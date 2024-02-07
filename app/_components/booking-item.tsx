import { Booking, Prisma } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      service: true
      barbershop: true
    }
  }>
}

const BookingItem = ({ booking }: BookingItemProps) => {

  return (
    <Card>
      <CardContent className="p-5 flex py-0">
        <div className="flex flex-col gap-2 py-5 flex-1">
          <Badge className="bg-[#221C3D] text-primary hover:bg-[#221C3D] w-fit">Confirmado</Badge>
          <h2 className="font-bold">{booking.service.name}</h2>

          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src="https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png" />

              <AvatarFallback>A</AvatarFallback>
            </Avatar>

            <h3 className="text-sm">{booking.barbershop.name}</h3>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center flex-1 px-3 border-l border-solid border-secondary">
          <p className="capitalize text-sm">{format(booking.date, 'MMM', {locale: ptBR})}</p>
          <p className="text-2xl">{format(booking.date, 'dd')}</p>
          <p className="capitalize text-sm">{format(booking.date, 'hh:mm')}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingItem;
