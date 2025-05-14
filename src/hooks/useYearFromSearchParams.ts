import { useSearchParams } from 'react-router-dom'

export default function useYearFromSearchParams() {
    const currentYear = new Date().getFullYear()
    const [searchParams, setSearchParams] = useSearchParams()
    const rawSearchYear = searchParams.get('year')
    let searchYear: number | null = null
    if (rawSearchYear) {
        searchYear = Number(rawSearchYear)
        if (Number.isNaN(searchYear)) {
            searchYear = null
        }
    }
    const yearToUse = searchYear ?? currentYear

    const setYear = (year: number) => {
        if (year === currentYear) {
            searchParams.delete('year')
        } else {
            searchParams.set('year', year.toString())
        }
        setSearchParams(searchParams)
    }
    return { yearToUse, setYear }
}
