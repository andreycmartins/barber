"use client "

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/components/input";
import { SearchIcon } from "lucide-react";

const Search = () => {
    return ( 
        <div className="flex items-center gap-2">
            <Input placeholder="busque por uma barbearia" />
            <Button variant="default">
                <SearchIcon size={18}/>
            </Button>
        </div>
     );
}
 
export default Search;