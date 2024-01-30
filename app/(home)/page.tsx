import Header from "../_components/header";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Search from "./_components/search";
import BookingItem from "../_components/booking-item";
import { db } from "../_lib/prisma";
import BarbershopItem from "./_components/barbershop-item";

export default function Home() {
  // const barbershops = await db.barbershop.findMany({})
  const barbershops = [
    {id: '1', name: 'barberoasdsadsadasdsadad', address: 'asd', imageUrl: 'https://www.alternativagameselan.com.br/web/fotos/produtos_55_produto-teste-nao-usar_www.alternativagameselan.com.br_zz4ef5edb9b8.png'},
    {id: '2', name: 'barbeariaetc', address: 'asd', imageUrl: 'https://aquitemplacas.com.br/img/produtos/g/36-atencao-area-de-teste.jpg'},
    {id: '3', name: 'barbeirosojkepoas', address: 'asd', imageUrl: 'https://www.alternativagameselan.com.br/web/fotos/produtos_55_produto-teste-nao-usar_www.alternativagameselan.com.br_zz4ef5edb9b8.png'},
    {id: '4', name: 'testearea', address: 'asd', imageUrl: 'https://aquitemplacas.com.br/img/produtos/g/36-atencao-area-de-teste.jpg'}
  ]
  return (
    <div>
      <Header />

      <div className="px-5 pt-5">
        <h2 className="text-xl font-bold">Olá, Andrey</h2>
        <p className="capitalize text-sm">{format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
      </div>

      <div className="px-5 mt-6">
        <Search />
      </div>

      <div className="px-5 mt-6">
        <h2 className="text-sm mb-3 uppercase text-gray-400 font-bol">Agendamentos</h2>
        <BookingItem />
      </div>

      <div className="mt-6">
        <h2 className=" px-5 text-sm mb-3 uppercase text-gray-400 font-bol">Recomendados</h2>
      </div>

      <div className="flex px-5 gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {barbershops.map((barbershop) => (
          <BarbershopItem key={barbershop.id} barbershop={barbershop} />
        ))}
      </div>
    </div> 

  );
}
