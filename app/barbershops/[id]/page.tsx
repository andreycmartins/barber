import { db } from '@/app/_lib/prisma'
import BarbershopInfo from './_components/barbershop-info'
import ServiceItem from './_components/service-item'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/_lib/auth'
import { Metadata } from 'next'

interface BarbershopDetailsPageProps {
  params: {
    id?: string
  }
}

export const metadata: Metadata = {
  title: 'Barbers',
}

const BarbershopDetailsPage = async ({
  params,
}: BarbershopDetailsPageProps) => {
  const session = await getServerSession(authOptions)

  if (!params.id) {
    return null
  }

  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id,
    },
    include: {
      services: true,
    },
  })

  if (!barbershop) {
    // TODO: redirecionar para home page
    return null
  }

  return (
    <div>
      <BarbershopInfo barbershop={barbershop} />

      <div className="px-5 flex flex-col gap-4 py-6">
        {barbershop.services.map((service) => (
          <ServiceItem
            isAuthenticated={!!session?.user}
            barbershop={barbershop}
            key={service.id}
            service={service}
          />
        ))}
      </div>
    </div>
  )
}

export default BarbershopDetailsPage
