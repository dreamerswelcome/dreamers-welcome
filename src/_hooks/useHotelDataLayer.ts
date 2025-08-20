import { useEffect } from "react";
import { useRouter } from "next/router";
import { hotelIdMap } from "../_utils/hotelIdMap";

export function useHotelDataLayer() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    // Use asPath (the actual URL) instead of pathname
    const path = router.asPath.toLowerCase().replace(/\/$/, "");
    window.dataLayer = window.dataLayer || [];

    // Case 1: Hotel detail page
    if (hotelIdMap[path]) {
      window.dataLayer.push({
        event: "hotelDetailView",
        hotel_id: hotelIdMap[path],
      });
      console.log("DataLayer pushed:", { event: "hotelDetailView", hotel_id: hotelIdMap[path] });
    }

    // Case 2: Search/listing pages
    if (path === "/stays/puertorico" || path === "/search" || path.includes("/results")) {
      const hotelIds = Object.values(hotelIdMap);
      if (hotelIds.length > 0) {
        window.dataLayer.push({
          event: "hotelSearchResults",
          hotel_ids: hotelIds,
        });
        console.log("DataLayer pushed:", { event: "hotelSearchResults", hotel_ids: hotelIds });
      }
    }
  }, [router.asPath, router.isReady]);
}
