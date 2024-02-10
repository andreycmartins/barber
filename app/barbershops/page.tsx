import { LucideChevronLeft } from "lucide-react"
import BarbershopItem from "../(home)/_components/barbershop-item"
import Header from "../_components/header"
import { Button } from "../_components/ui/button"
import { db } from "../_lib/prisma"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Search from "../(home)/_components/search"

interface BarbershopsPageProps {
  searchParams: {
    search?: string
  }
}

export default async function BarbershopsPage({searchParams}: BarbershopsPageProps) {
  const barbershops = await db.barbershop.findMany({
    where: {
      name: {
        contains: searchParams.search,
        mode: 'insensitive'
      }
    }
  })

  return (
    <>
      <Header />
      <div className="px-5 py-6">
        <Link href="/">
          <Button className="mb-3">
            <LucideChevronLeft />
            Voltar
          </Button>
        </Link> 

        <div className="my-3">
          <Search
            defaultValues={{
              search: searchParams.search || ""
            }}
          />
        </div>

        <h1 className="text-gray-400 font-bold text-xs uppercase">Resultados para {searchParams.search}</h1>

        <div className="grid grid-cols-2 mt-3 gap-4">
          {barbershops.map((barbershop) => (
            <div className="w-full" key={barbershop.id} >
              <BarbershopItem barbershop={barbershop} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}