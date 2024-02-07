import { getServerSession } from "next-auth";
import Header from "../_components/header";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { db } from "../_lib/prisma";
import BookingItem from "../_components/booking-item";

const BookingsPage = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user) return redirect('/')

  const bookings = await db.booking.findMany({
    where: {
      userId: (session.user as any).id
    },
    include: {
      service: true,
      barbershop: true,
    }
  })

  return ( 
      <>
        <Header />

        <div>
          <h1 className="text-xl">Agendamentos</h1>

          <h2>Confirmados</h2>

          <div className="flex flex-col gap-3">
            {bookings.map(booking => <BookingItem booking={booking} key={booking.id} />)}
          </div>
        </div>
      </>
    );
}
 
export default BookingsPage;