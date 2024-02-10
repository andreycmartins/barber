import { getServerSession } from "next-auth"
import Header from "../_components/header"
import { authOptions } from "../_lib/auth"
import { redirect } from "next/navigation"
import { db } from "../_lib/prisma"
import BookingItem from "../_components/booking-item"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Barbers',
}

const BookingsPage = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user) return redirect('/')

  const [finishedBookings, confirmedBookings] = await Promise.all([
    db.booking.findMany({
      where: {
        userId: (session.user as any).id,
        date: {
          lt: new Date()
        }
      },
      include: {
        service: true,
        barbershop: true,
      }
    }),

    db.booking.findMany({
      where: {
        userId: (session.user as any).id,
        date: {
          gte: new Date()
        }
      },
      include: {
        service: true,
        barbershop: true,
      }
    }),
  ])

  return ( 
      <>
        <Header />

        <div className="">
          <h1 className="text-xl pl-5 mb-6 uppercase font-bold">Agendamentos</h1>

          {confirmedBookings.length > 0 && (
            <>
              <h2 className="mt-6 px-5 text-xs mb-3 uppercase text-gray-400 font-bold">Confirmados</h2>
              <div className="px-5 mb-3 flex flex-col gap-3">
                {confirmedBookings.map(booking => <BookingItem booking={booking} key={booking.id} />)}
              </div>
            </>
          )}

          {finishedBookings.length > 0 && (
            <>
              <h2 className="px-5 text-xs mb-3 uppercase text-gray-400 font-bold">Finalizados</h2>
              <div className="px-5 mb-3 flex flex-col gap-3">
                {finishedBookings.map(booking => <BookingItem booking={booking} key={booking.id} />)}
              </div>
            </>
          )}

        </div>
      </>
    )
}
 
export default BookingsPage