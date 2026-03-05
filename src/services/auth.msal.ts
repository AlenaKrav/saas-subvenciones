import jwt, { JwtPayload } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const AZURE_TENANT_ID = process.env.AZURE_TENANT_ID!;
const AZURE_CLIENT_ID = process.env.AZURE_CLIENT_ID!;

// Function to create a client to download Microsfot public keys
const client = jwksClient({
    //The URL relatedd to our where Microsoft publish its public keys
    jwksUri: `https://login.microsoftonline.com/${AZURE_TENANT_ID}/discovery/v2.0/keys`,
    cache: true,
    cacheMaxAge: 86400000,
});

// Function to obtain public key to verify the token
// KID is key id of a key used by Microsoft to sign tokens
async function getSignInKey(kid: string): Promise<string> {
    try {
        // Download a public key with given KID
        const key = await client.getSigningKey(kid);
        // Extract the public key in usable format (string instead of Object)
        const publicKey = key.getPublicKey();
        return publicKey;
    } catch (error) {
        console.error('Error getting signing key:', error);
        throw new Error('Failed to get signing key');
    }

};

// Function to verify if the JWT token signed by Microsoft is legitimate
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
        // Obtain KID of Microsoft public key of our token
        const publicKey = await getSignInKey(decoded.header.kid!);
        // Verify our token using Microsoft public key
        const verified = jwt.verify(token, publicKey, {
            // Verify if token was emitted for our aplication, comparing our clienId with aud value of the token
            audience: AZURE_CLIENT_ID,
            // Verify if token was emitted by our specific Tenant
            issuer: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0`
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