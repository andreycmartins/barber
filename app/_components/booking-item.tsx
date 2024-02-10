'use client'

import { Prisma } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { format, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import Image from "next/image";
import { Button } from "./ui/button";
import { cancelBooking } from "../_actions/cancel-booking";
import { useToast } from "./ui/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      service: true
      barbershop: true
    }
  }>
}

const BookingItem = ({ booking }: BookingItemProps) => {
  const isBookingConfirmed = isPast(booking.date)
  const [submitIsLoading, setSubmitIsLoading] = useState(false)

  const { toast } = useToast()

  async function handleCancelClick() {
    try {
      setSubmitIsLoading(true)
      await cancelBooking(booking.id)

      toast({
        title: "Reserva cancelada com sucesso!",
        style: {
          backgroundColor: 'green'
        }
      })
    } catch (error){
      toast({
        title: 'Não foi possível deletar a reserva...',
        description: String(error),
        style: {
          backgroundColor: 'red'
        }
      })
      console.error(error)
      setSubmitIsLoading(false)
    }
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card>
          <CardContent className="py-0 px-0 flex">
            <div className="flex flex-col gap-2 py-5 flex-[3] px-5">
              <Badge variant={isBookingConfirmed ? "secondary" : "default"} className="w-fit">{isBookingConfirmed ? "Finalizado" : "Confirmado"}</Badge>
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
      </SheetTrigger>

      <SheetContent className="px-0 w-full">
        <SheetHeader className="px-5 text-left pb-6 border-b border-solid border-secondary">
          <SheetTitle>Informações da Reserva</SheetTitle>
        </SheetHeader>

        <div className="px-5">
          <div className="relative h-[180px] w-full mt-6">
          <Image src="/molusco.jpg" fill alt={booking.barbershop.name}/> 

            <div className="w-full absolute bottom-4 left-0 px-5">
              <Card className="mx-5">
                <CardContent className="p-3 flex gap-2">
                  <Avatar>
                    <AvatarImage src={booking.barbershop.imageUrl}></AvatarImage>
                  </Avatar>

                  <div>
                    <h2 className="font-bold">{booking.barbershop.name}</h2>
                    <h3 className="text-xs overflow-hidden text-nowrap text-ellipsis">{booking.barbershop.address}</h3>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <Badge variant={isBookingConfirmed ? "secondary" : "default"} className="w-fit my-3">{isBookingConfirmed ? "Finalizado" : "Confirmado"}</Badge>

          <Card>
            <CardContent className="p-3">
              <div className="flex justify-between items-center py-1 border-b border-solid border-secondary">
                <h2 className="font-bold">{booking.service.name}</h2>
                <p className="font-bold text-sm">
                  {Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(booking.service.price))}
                </p>
              </div>
              {booking.date && (
                <div className="flex justify-between py-1 border-b border-solid border-secondary">
                  <p className="text-gray-400 text-sm">Data</p>
                  <p className="text-gray-400 text-sm">
                    {format(booking.date, "dd 'de' MMMM", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-solid border-secondary">
                <p className="text-gray-400 text-sm">Horário</p>
                <p className="text-gray-400 text-sm">{format(booking.date, "hh:mm")}</p>
              </div>

              <div className="flex justify-between py-1">
                <p className="text-gray-400 text-sm">Barbearia</p>
                <p className="text-gray-400 text-sm">{booking.barbershop.name}</p>
              </div>
            </CardContent>
          </Card>

          <SheetFooter className="flex flex-row gap-3 mt-3">
            <SheetClose asChild>
              <Button className="w-full" variant="secondary">Voltar</Button>
            </SheetClose>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                {!isBookingConfirmed && (
                  <Button className="w-full" variant="destructive" disabled={submitIsLoading}>
                  Cancelar reserva
                  </Button>
                )}
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[90%]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancelar reserva de {booking.service.name}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Uma vez cancelada, não será possível reverter essa ação.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-row justify-between items-end gap-3">
                  <AlertDialogCancel className="w-full">Voltar</AlertDialogCancel>
                  <AlertDialogAction disabled={submitIsLoading} className="w-full" onClick={handleCancelClick}>
                    Confirmar
                    </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BookingItem