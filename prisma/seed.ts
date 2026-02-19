import { PrismaClient, Prisma } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter: pool })

// const userData: Prisma.UserCreateInput[] = [
//   {
//     name: 'Alice',
//     email: 'alice@prisma.io'
//   },
//   {
//     name: 'Nilu',
//     email: 'nilu@prisma.io'
//   },
//   {
//     name: 'Mahmoud',
//     email: 'mahmoud@prisma.io'
//   },
// ]


const productData: Prisma.ProductCreateInput[] = [
  {
    name: "Classic Red Pullover Hoodie",
    description: "Elevate your casual wardrobe with our Classic Red Pullover Hoodie. Crafted with a soft cotton blend for ultimate comfort."
  },
    {
    name: "Sleek Comfort-Fit Over-Ear Headphones",
    description: "Experience superior sound quality with our Sleek Comfort-Fit Over-Ear Headphones."
  },
  {
    name: "Modern Ergonomic Office Chair",
    description: "Elevate your office space with this sleek and comfortable Modern Ergonomic Office Chair"
  },
]

async function main() {
  console.log(`Start seeding ...`)

  // Clear existing data
  await prisma.product.deleteMany()

  for (const p of productData) {
    const product = await prisma.product.create({
      data: p,
    })
    console.log(`Created user with id: ${product.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
