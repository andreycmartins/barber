"use client"

import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Badge } from "@/app/components/badge";
import { Barbershop } from "@prisma/client/edge";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface BarbershopItemProps {
    barbershop: Barbershop
}

const BarbershopItem = ({barbershop}: BarbershopItemProps) => {
  const router = useRouter()

  const handleBookingClick = () => {
    router.push(`/barbershops/${barbershop.id}`)
  }


  return ( 
      <Card className="min-w-[167px] max-w-[167px]">
          <CardContent className="p-0">
              <div className="px-2 w-full h-[159px] relative">
                <div className="absolute top-2 left-2 z-50">
                  <Badge variant="secondary" className="opacity-90 flex gap-1 items-center justify-center">
                    <StarIcon size={12} className="fill-primary text-primary"/>
                    <span>5,0</span>
                  </Badge>
                </div>
                <Image
                  src={barbershop.imageUrl} alt={barbershop.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="px-3 pb-1">
                <h2 className="overflow-hidden text-ellipsis text-nowrap">{barbershop.name}</h2>
                <p className="text-sm mt-3 text-gray-400 overflow-hidden text-ellipsis text-nowrap">{barbershop.address}</p>
                <Button onClick={handleBookingClick} className="w-full mt-3 hover:bg-[#8161ff]" variant="secondary">Reservar</Button>
              </div>
          </CardContent>
      </Card>
    );
}
 
export default BarbershopItem;