"use client";
import { useEffect, useState } from "react";
import { Results } from "./Results";
import { Pagination } from "./Pagination";
import { useRouter, usePathname } from "next/navigation";
import queryString from "query-string";
import { Filters } from "./Filters";

export const PropertySearch = () => {
    const [properties, setProperties] = useState([]);
    const [totalResults, settotalResults] = useState([]);
    const pageSize = 3;
    const router = useRouter();
    const pathname = usePathname();

    const search = async () => {
        const {page, minPrice, maxPrice, hasParking, petFriendly} = queryString.parse(window.location.search);
        const filters = {};
        if (minPrice) {
            filters.minPrice = parseInt(minPrice);
        }
        if (maxPrice) {
            filters.maxPrice = parseInt(maxPrice);
        }
        if (hasParking === "true") {
            filters.hasParking = true;
        }
        if (petFriendly === "true") {
            filters.petFriendly = true;
        }
        const response = await fetch(`/api/search`,{
            method: "POST",
            body: JSON.stringify({
                page: parseInt(page || "1"),
                ...filters, 
            }),
        });
        const data = await response.json();
        console.log("SEARCH DATA:", data);
        setProperties(data.properties);
        settotalResults(data.total);
    };
    const handlePageClick = async (pageNumber) => {
        const {
            petFriendly,
            hasParking,
            minPrice,
            maxPrice,
        } = queryString.parse(window.location.search);
        
        router.push(`${pathname}?page=${pageNumber}&petFriendly=${petFriendly === "true"}&hasParking=${hasParking === "true"}&minPrice=${minPrice}&maxPrice=${maxPrice}`);
    };

    useEffect (() => {
        search();
    },[]);

    const handleSearch = async ({petFriendly,hasParking,minPrice,maxPrice,}) => {
        router.push(`${pathname}?page=1&petFriendly=${!!petFriendly}&hasParking=${!!hasParking}&minPrice=${minPrice}&maxPrice=${maxPrice}`);
    };
    return (
        <div>
            <Filters onSearch={handleSearch}/>
            <Results properties={properties}/>  
            <Pagination onPageClick={handlePageClick} totalPages={Math.ceil(totalResults / pageSize)}/>
        </div>
    );
};
