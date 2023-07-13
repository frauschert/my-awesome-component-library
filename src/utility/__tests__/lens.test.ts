import { createLens, composeLens } from '../lens'

describe('createLens', () => {
    interface Person {
        name: string
        age: number
    }

    const person: Person = {
        name: 'John Doe',
        age: 30,
    }

    it('should get the value using the lens', () => {
        const nameLens = createLens<Person, 'name'>(
            (p) => p.name,
            (p, name) => ({ ...p, name })
        )

        const name = nameLens.get(person)

        expect(name).toBe('John Doe')
    })

    it('should set the value using the lens', () => {
        const ageLens = createLens<Person, 'age'>(
            (p) => p.age,
            (p, age) => ({ ...p, age })
        )

        const updatedPerson = ageLens.set(person, 35)

        expect(updatedPerson).toEqual({ name: 'John Doe', age: 35 })
    })
})

describe('composeLens', () => {
    interface Address {
        street: string
        city: string
    }

    interface Person {
        name: string
        address: Address
    }

    const person: Person = {
        name: 'John Doe',
        address: {
            street: '123 Main St',
            city: 'New York',
        },
    }

    it('should get the value using the composed lens', () => {
        const addressLens = createLens<Person, 'address'>(
            (p) => p.address,
            (p, address) => ({ ...p, address })
        )
        const streetLens = createLens<Address, 'street'>(
            (a) => a.street,
            (a, street) => ({ ...a, street })
        )

        const composedLens = composeLens(addressLens, streetLens)
        const street = composedLens.get(person)

        expect(street).toBe('123 Main St')
    })

    it('should set the value using the composed lens', () => {
        const addressLens = createLens<Person, 'address'>(
            (p) => p.address,
            (p, address) => ({ ...p, address })
        )
        const cityLens = createLens<Address, 'city'>(
            (a) => a.city,
            (a, city) => ({ ...a, city })
        )

        const composedLens = composeLens(addressLens, cityLens)
        const updatedPerson = composedLens.set(person, 'Los Angeles')

        expect(updatedPerson).toEqual({
            name: 'John Doe',
            address: {
                street: '123 Main St',
                city: 'Los Angeles',
            },
        })
    })
})
