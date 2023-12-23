import { useEffect, useState } from "react";

export const usePageContext = <T = unknown>() => {
    const [pageContext, setPageContext] = useState<T | undefined>(undefined)
    useEffect(() => {
        const pageContext = document.getElementById('page-context')?.textContent
        if (typeof pageContext === "string") {
          setPageContext(JSON.parse(pageContext))
        }
    }, [])
    return pageContext as T
}