import jwt, { JwtPayload } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const AZURE_CLIENT_ID = process.env.AZURE_CLIENT_ID!;
const AZURE_JWKS_URI = process.env.AZURE_JWKS_URI!;
const AZURE_ISSUER = process.env.AZURE_ISSUER!

const client = jwksClient({
    jwksUri: AZURE_JWKS_URI,
    cache: true,
    cacheMaxAge: 86400000,
});


async function getSignInKey(kid: string): Promise<string> {
    try {
        const key = await client.getSigningKey(kid);
        const publicKey = key.getPublicKey();
        return publicKey;
    } catch (error) {
        console.error('Error getting signing key:', error);
        throw new Error('Failed to get signing key');
    }
};

export async function verifyMsalToken(token: string): Promise<{
    userId: string;
    email: string;
    name?: string;
}> {
    try {
        const decoded = jwt.decode(token, { complete: true });
        if (!decoded || typeof decoded === 'string' || typeof decoded.payload === 'string') {
            throw new Error('Invalid token format')
        }
        const publicKey = await getSignInKey(decoded.header.kid!);
        const verified = jwt.verify(token, publicKey, {
            audience: AZURE_CLIENT_ID,
            issuer: AZURE_ISSUER,
            algorithms: ['RS256']
        }) as JwtPayload;

        return {
            userId: verified.oid || verified.sub,
            email: verified.preferred_username || verified.email || verified.upn,
            name: verified.name
        }
    }
    catch (error) {
        console.error('Token verification error:', error);
        throw new Error('Failed to verify token');
    }

}