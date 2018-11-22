import { getWindSpeedAndBearing } from '../getters/planes'
import { state } from '../client'

const setNewUISelectionListItem = (list, options) => {
    const { title, value, identifier } = options

    const item = document.createElement('li')
    const h3 = document.createElement('h3')

    item.appendChild(h3)
        .textContent = title

    const span = document.createElement('span')

    item.appendChild(span)
        .textContent = value

    item.id = identifier
    list.appendChild(item)
}

const updateExistingUISelectionListItem = (options) => {
    const { value, identifier,  } = options

    if (Array.isArray(value)) {
        const booksListItem = document.getElementById('books')
        const dataList = booksListItem.parentElement
        booksListItem.innerHTML = ''

        const h3 = document.createElement('h3')
        const amountOfBooks = value.length

        booksListItem.appendChild(h3)
            .textContent = `Boek${amountOfBooks === 1 ? '' : 'en'} (${amountOfBooks})`

        value
            .sort((a, b) => a > b ? 1 : -1)
            .map(v => {
                const span = document.createElement('span')

                booksListItem
                    .appendChild(span)
                    .textContent = v
            })

        booksListItem.classList.add('data-list')
        booksListItem.classList.add('data-list--multiple')

        dataList.appendChild(booksListItem)
    } else {
        const textElement = document.getElementById(identifier).querySelector('span')
        textElement.textContent = value
    }
}

export const setUISelectionSettings = async () => {
    const { interactionOptions } = state
    const { flySpeed, distanceBetweenCities, airplane, readableFlyTime, books } = interactionOptions
    const { windBearing, windSpeedInKmh } = await getWindSpeedAndBearing()
    const list = document.getElementById('settings-list')

    const roundFlySpeed = Math.floor(flySpeed)
    const roundDistance = Math.floor(distanceBetweenCities)
    const planePlaceholder = 'Selecteer een vliegtuig'
    const placeholderForInfoRequiringPlane = airplane
        ? 'Selecteer een locatie'
        : planePlaceholder

    const dataOptions = [
        {
            title: `Vliegtuig type`,
            value: airplane || planePlaceholder,
            identifier: 'plane-type'
        },
        {
            title: `Kruissnelheid`,
            value: roundFlySpeed ? `${roundFlySpeed}km/h` : placeholderForInfoRequiringPlane,
            identifier: 'plane-speed'
        },
        {
            title: `Afstand`,
            value: roundDistance ? `${roundDistance}km` : placeholderForInfoRequiringPlane,
            identifier: 'distance'
        },
        {
            title: `Geschatte vluchtduur`,
            value: readableFlyTime || placeholderForInfoRequiringPlane,
            identifier: 'flight-duration'
        },
        {
            title: `Windsnelheid`,
            value: windSpeedInKmh ? `${Math.floor(windSpeedInKmh)}km/h` : placeholderForInfoRequiringPlane,
            identifier: 'wind-speed',
        },
        {
            title: `Windrichting`,
            value: windBearing ? `${windBearing}˚̊̊` : placeholderForInfoRequiringPlane,
            identifier: 'wind-bearing',
        },
        {
            title: `Boeken`,
            value: books || 'Geen boeken gevonden',
            identifier: 'books'
        }
    ]

    if (!list.childNodes.length) {
        dataOptions.forEach(options => setNewUISelectionListItem(list, options))
        return null
    }

    dataOptions.forEach(updateExistingUISelectionListItem)
}