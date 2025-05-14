import { collection, getFirestore } from 'firebase/firestore'
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore'

const firestore = getFirestore()

export default function useBongCompetitions() {
    const [allSettings, settingsLoading] = useCollectionDataOnce(
        collection(firestore, 'settings'),
        {
            idField: 'uid',
        }
    )

    const bongCompetitions =
        allSettings?.filter((setting) =>
            setting.uid.includes('bongCompetition')
        ) ?? []
    const years = bongCompetitions
        .map((comp) => {
            const year = parseInt(comp.uid.split('_')[1], 10)
            return Number(year)
        })
        .filter((year) => !Number.isNaN(year))
    years.sort((a, b) => b - a)

    return { years, bongCompetitions, isLoading: settingsLoading }
}
