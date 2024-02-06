"use client"

import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/app/_components/ui/sheet";
import { Barbershop, Booking, Service } from "@prisma/client";
import { ptBR } from "date-fns/locale";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import generateDayTimeList from "../_helpers/hours";
import { format, setHours, setMinutes } from "date-fns";
import saveBooking from "../_actions/save-bookings";
import { Loader2 } from "lucide-react";
import { useToast } from "@/app/_components/ui/use-toast";
import { ToastAction } from "@/app/_components/ui/toast";
import { useRouter } from "next/navigation";
import getDayBookings from "../_actions/get-day-bookings";

interface ServiceItemProps {
  service: Service
  isAuthenticated?: boolean
  barbershop: Barbershop
}

interface User {
  id: string
  name: string
  email: string
  image: string
}

const ServiceItem = ({ service, isAuthenticated, barbershop }: ServiceItemProps) => {
  const { data: userData } = useSession()
  const router = useRouter()
  const [date, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedHour, setSelectedHour] = useState<string | undefined>( )
  const [submitIsLoading, setSubmitIsLoading] = useState(false)
  const [sheetIsOpen, setSheetIsOpen] = useState(false)
  const [dayBookings, setDayBookings] = useState<Booking[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (!date) {
      return
    }
    const refreshAvailableHours = async() => {
      const _dayBookings = await getDayBookings(barbershop.id, date)
      setDayBookings(_dayBookings)
    }
    refreshAvailableHours()
  }, [barbershop.id, date])

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      signIn('google')
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedHour(undefined)
  }

  const handleSelectedHour = (time: string) => {
    setSelectedHour(time)
  }

  const handleBookingSubmit = async () => {
    try {
      if (!selectedHour || !date || !userData ) {
        return
      }

      const dateHour = Number(selectedHour.split(':')[0])
      const dateMinutes = Number(selectedHour.split(':')[1])
      const newDate = setMinutes(setHours(date, dateHour), dateMinutes)
      
      setSubmitIsLoading(true)
      await saveBooking({
        serviceId: service.id,
        barbershopId: barbershop.id,
        date: newDate,
        userId: (userData.user as User).id
      })
        setSubmitIsLoading(false)
        setSelectedDate(undefined)
        setSelectedHour(undefined)
        toast({
          title: "Reserva concluída",
          description: format(newDate, "'Para' dd 'de' MMM 'às' HH':'mm'.'", {
            locale: ptBR
          }),
          action: (
            <div onClick={() => router.push('/bookings')}>
              <ToastAction altText="Ok">Visualizar</ToastAction>
            </div>
          )
        })
        setSheetIsOpen(false)

    } catch (error) {
      console.log(error)
    } finally {
      setSubmitIsLoading(false)
      
    }
  }

  const timeList = useMemo(() => {
    if (!date) {
      return []
    }

    return generateDayTimeList(date).filter(time => {
    const timeHour = Number(time.split(':')[0])
    const timeMinutes = Number(time.split(':')[1])

    const booking = dayBookings.find(booking => {
      const bookingHour = booking.date.getHours()
      const bookingMinutes = booking.date.getMinutes()

      return bookingHour === timeHour && bookingMinutes === timeMinutes
    })

    if (!booking) {
      return true
    }
    
    return false

    })
  }, [date, dayBookings])

  return (
    <Card>
      <CardContent className="p-3 w-full">
        <div className="flex gap-4 items-center w-full">
          <div className="relative min-h-[110px] min-w-[110px] max-h-[110px] max-w-[110px]">
            <Image
              className="rounded-lg"
              src={service.imageUrl}
              fill
              style={{ objectFit: "contain" }}
              alt={service.name}
            />
          </div>

          <div className="flex flex-col">
            <h2 className="font-bold">{service.name}</h2>
            <p className="text-sm text-gray-400">{service.description}</p>

            <div className="flex w-full items-center justify-between mt-3">
              <p className="text-primary text-sm font-bold">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(service.price))}
              </p>
              <Sheet open={sheetIsOpen} onOpenChange={() => {setSheetIsOpen(true)}}>
                <SheetTrigger asChild>
                  <Button variant="secondary" onClick={handleBookingClick}>Reservar</Button>
                </SheetTrigger>

                <SheetContent className="p-0">
                  <SheetHeader className="text-left px-5 py-6 border-b border-solid border-secondary">
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    fromDate={new Date()}
                    locale={ptBR}
                    styles={{
                      head_cell: {
                        width: '100%',
                        textTransform: 'capitalize',
                      },
                      cell: {
                        width: '100%'
                      },
                      button: {
                        width: '100%',
                        borderRadius: '0px'
                      },
                      caption: {
                        textTransform: 'capitalize'
                      },
                      nav_button_previous: {
                        width: '32px',
                        height: '32px'
                      },
                      nav_button_next: {
                        width: '32px',
                        height: '32px'
                      },
                    }}
                  />

                  {date && (
                    <div className="flex overflow-x-auto gap-2 py-6 px-5 border-y border-solid border-secondary [&::-webkit-scrollbar]:hidden">
                      {timeList.map((time) => (
                        <Button onClick={() => handleSelectedHour(time)} variant={selectedHour === time ? 'default' : 'outline'} className="rounded-full border border-secondary" key={time}>{time}</Button>
                      ))}
                    </div>
                  )}

                  <div className="py-6 px-5 border-t border-solid border-secondary">
                    <Card>
                      <CardContent className="p-3">
                        <div className="flex justify-between items-center py-1 border-b border-solid border-secondary">
                          <h2 className="font-bold">{service.name}</h2>
                          <p className="font-bold text-sm">
                            {Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(Number(service.price))}
                          </p>
                        </div>
                        {date && (
                          <div className="flex justify-between py-1 border-b border-solid border-secondary">
                            <p className="text-gray-400 text-sm">Data</p>
                            <p className="text-gray-400 text-sm">
                              {format(date, "dd 'de' MMMM", {
                                locale: ptBR,
                              })}
                            </p>
                          </div>
                        )}
                        {selectedHour && (
                          <div className="flex justify-between py-1">
                            <p className="text-gray-400 text-sm">Horário</p>
                            <p className="text-gray-400 text-sm">{selectedHour}</p>
                          </div>
                        )}

                        <div className="flex justify-between py-1">
                          <p className="text-gray-400 text-sm">Barbearia</p>
                          <p className="text-gray-400 text-sm">{barbershop.name}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <SheetFooter className="px-3">
                    <Button onClick={handleBookingSubmit} disabled={!selectedHour || !date || submitIsLoading}>
                      {submitIsLoading && (  
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Confirmar reserva
                      </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceItem;
