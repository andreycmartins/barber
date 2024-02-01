import { db } from "@/app/_lib/prisma"
import BarbershopInfo from "./_components/barbershop-info"
import ServiceItem from "./_components/service-item"
import { Service } from "@prisma/client/edge"

const BarbershopDetailsPage = async ({params}: Service) => {
  if (!params.id) {
    return null
  }

  const barbershop = await db.barbershop.findUnique({
    where: {
        id: params.id
    },
    include: {
      services: true
    }
  })

  if (!barbershop) {
    // TODO
    return 'barbearia nao encontrata'
  }

  return (
    <div>
      <BarbershopInfo barbershop={barbershop}/>
      <div className="px-5 flex flex-col gap-4 py-6">
        {barbershop.services.map((service: Service) => (
          <ServiceItem key={service.id} service={service}/>
        ))}
      </div>
    </div>
    );
}
 
export default BarbershopDetailsPage;