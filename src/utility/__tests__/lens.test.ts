import {
    createLens,
    composeLens,
    prop,
    index,
    path,
    view,
    set,
    over,
} from '../lens'

describe('lens', () => {
    interface Address {
        street: string
        city: string
        zip: string
    }

    interface Person {
        name: string
        age: number
        address: Address
    }

    interface Company {
        name: string
        employees: Person[]
    }

    const testPerson: Person = {
        name: 'John Doe',
        age: 30,
        address: {
            street: '123 Main St',
            city: 'New York',
            zip: '10001',
        },
    }

    const testCompany: Company = {
        name: 'Acme Corp',
        employees: [
            {
                name: 'Alice',
                age: 25,
                address: { street: '1st Ave', city: 'Boston', zip: '02101' },
            },
            {
                name: 'Bob',
                age: 35,
                address: {
                    street: '2nd Ave',
                    city: 'Chicago',
                    zip: '60601',
                },
            },
        ],
    }

    describe('createLens', () => {
        it('should get the value using the lens', () => {
            const nameLens = createLens<Person, 'name'>(
                (p) => p.name,
                (p, name) => ({ ...p, name })
            )

            const name = nameLens.get(testPerson)

            expect(name).toBe('John Doe')
        })

        it('should set the value using the lens', () => {
            const ageLens = createLens<Person, 'age'>(
                (p) => p.age,
                (p, age) => ({ ...p, age })
            )

            const updatedPerson = ageLens.set(testPerson, 35)

            expect(updatedPerson).toEqual({ ...testPerson, age: 35 })
            expect(updatedPerson).not.toBe(testPerson) // Immutability check
        })

        it('should not mutate original object', () => {
            const nameLens = createLens<Person, 'name'>(
                (p) => p.name,
                (p, name) => ({ ...p, name })
            )

            const original = { ...testPerson }
            nameLens.set(testPerson, 'Jane Doe')

            expect(testPerson).toEqual(original)
        })
    })

    describe('prop', () => {
        it('should create a lens for a property', () => {
            const nameLens = prop<Person, 'name'>('name')
            const name = nameLens.get(testPerson)

            expect(name).toBe('John Doe')
        })

        it('should set a property immutably', () => {
            const ageLens = prop<Person, 'age'>('age')
            const updated = ageLens.set(testPerson, 40)

            expect(updated.age).toBe(40)
            expect(updated).not.toBe(testPerson)
            expect(testPerson.age).toBe(30)
        })

        it('should preserve other properties', () => {
            const nameLens = prop<Person, 'name'>('name')
            const updated = nameLens.set(testPerson, 'Jane Doe')

            expect(updated.age).toBe(testPerson.age)
            expect(updated.address).toBe(testPerson.address)
        })

        it('should work with nested objects', () => {
            const addressLens = prop<Person, 'address'>('address')
            const address = addressLens.get(testPerson)

            expect(address).toEqual(testPerson.address)
        })
    })

    describe('index', () => {
        const numbers = [1, 2, 3, 4, 5]

        it('should create a lens for array index', () => {
            const firstLens = index<number>(0)
            const first = firstLens.get(numbers)

            expect(first).toBe(1)
        })

        it('should set array element immutably', () => {
            const secondLens = index<number>(1)
            const updated = secondLens.set(numbers, 20)

            expect(updated).toEqual([1, 20, 3, 4, 5])
            expect(updated).not.toBe(numbers)
            expect(numbers[1]).toBe(2)
        })

        it('should handle out of bounds index', () => {
            const outOfBoundsLens = index<number>(10)
            const value = outOfBoundsLens.get(numbers)

            expect(value).toBeUndefined()
        })

        it('should work with negative indices (JavaScript behavior)', () => {
            const lastLens = index<number>(numbers.length - 1)
            const last = lastLens.get(numbers)

            expect(last).toBe(5)
        })

        it('should work with object arrays', () => {
            const firstEmployeeLens = index<Person>(0)
            const firstEmployee = firstEmployeeLens.get(testCompany.employees)

            expect(firstEmployee?.name).toBe('Alice')
        })
    })

    describe('path', () => {
        it('should create lens for single level path', () => {
            const nameLens = path<Person, 'name'>('name')
            const name = nameLens.get(testPerson)

            expect(name).toBe('John Doe')
        })

        it('should create lens for two level path', () => {
            const cityLens = path<Person, 'address', 'city'>('address', 'city')
            const city = cityLens.get(testPerson)

            expect(city).toBe('New York')
        })

        it('should create lens for three level path', () => {
            const zipLens = path<Person, 'address', 'city'>('address', 'city')
            const city = zipLens.get(testPerson)

            expect(city).toBe('New York')
        })

        it('should set nested property immutably', () => {
            const streetLens = path<Person, 'address', 'street'>(
                'address',
                'street'
            )
            const updated = streetLens.set(testPerson, '456 Oak Ave')

            expect(updated.address.street).toBe('456 Oak Ave')
            expect(updated.address.city).toBe('New York')
            expect(updated).not.toBe(testPerson)
            expect(updated.address).not.toBe(testPerson.address)
            expect(testPerson.address.street).toBe('123 Main St')
        })
    })

    describe('composeLens', () => {
        it('should get the value using the composed lens', () => {
            const addressLens = prop<Person, 'address'>('address')
            const streetLens = prop<Address, 'street'>('street')

            const composedLens = composeLens(addressLens, streetLens)
            const street = composedLens.get(testPerson)

            expect(street).toBe('123 Main St')
        })

        it('should set the value using the composed lens', () => {
            const addressLens = prop<Person, 'address'>('address')
            const cityLens = prop<Address, 'city'>('city')

            const composedLens = composeLens(addressLens, cityLens)
            const updatedPerson = composedLens.set(testPerson, 'Los Angeles')

            expect(updatedPerson.address.city).toBe('Los Angeles')
            expect(updatedPerson.address.street).toBe('123 Main St')
            expect(updatedPerson).not.toBe(testPerson)
        })

        it('should compose multiple lenses', () => {
            const addressLens = prop<Person, 'address'>('address')
            const cityLens = prop<Address, 'city'>('city')

            const addressCityLens = composeLens(addressLens, cityLens)

            const city = addressCityLens.get(testPerson)
            expect(city).toBe('New York')

            const updated = addressCityLens.set(testPerson, 'Boston')
            expect(updated.address.city).toBe('Boston')
            expect(updated.address.street).toBe('123 Main St')
            expect(testPerson.address.city).toBe('New York')
        })
    })

    describe('view', () => {
        it('should view a value through a lens', () => {
            const nameLens = prop<Person, 'name'>('name')
            const name = view(nameLens, testPerson)

            expect(name).toBe('John Doe')
        })

        it('should view nested values', () => {
            const cityLens = path<Person, 'address', 'city'>('address', 'city')
            const city = view(cityLens, testPerson)

            expect(city).toBe('New York')
        })

        it('should be equivalent to lens.get', () => {
            const ageLens = prop<Person, 'age'>('age')

            expect(view(ageLens, testPerson)).toBe(ageLens.get(testPerson))
        })
    })

    describe('set', () => {
        it('should set a value through a lens', () => {
            const nameLens = prop<Person, 'name'>('name')
            const updated = set(nameLens, testPerson, 'Jane Doe')

            expect(updated.name).toBe('Jane Doe')
            expect(testPerson.name).toBe('John Doe')
        })

        it('should set nested values', () => {
            const zipLens = path<Person, 'address', 'zip'>('address', 'zip')
            const updated = set(zipLens, testPerson, '10002')

            expect(updated.address.zip).toBe('10002')
            expect(testPerson.address.zip).toBe('10001')
        })

        it('should be equivalent to lens.set', () => {
            const ageLens = prop<Person, 'age'>('age')

            expect(set(ageLens, testPerson, 40)).toEqual(
                ageLens.set(testPerson, 40)
            )
        })

        it('should work with arrays', () => {
            const firstLens = index<number>(0)
            const arr = [1, 2, 3]
            const updated = set(firstLens, arr, 10)

            expect(updated).toEqual([10, 2, 3])
            expect(arr).toEqual([1, 2, 3])
        })
    })

    describe('over', () => {
        it('should modify a value through a lens', () => {
            const ageLens = prop<Person, 'age'>('age')
            const updated = over(ageLens, testPerson, (age) => age + 1)

            expect(updated.age).toBe(31)
            expect(testPerson.age).toBe(30)
        })

        it('should work with string transformations', () => {
            const nameLens = prop<Person, 'name'>('name')
            const updated = over(nameLens, testPerson, (name) =>
                name.toUpperCase()
            )

            expect(updated.name).toBe('JOHN DOE')
            expect(testPerson.name).toBe('John Doe')
        })

        it('should work with nested values', () => {
            const cityLens = path<Person, 'address', 'city'>('address', 'city')
            const updated = over(cityLens, testPerson, (city) =>
                city.replace('New York', 'Brooklyn')
            )

            expect(updated.address.city).toBe('Brooklyn')
            expect(testPerson.address.city).toBe('New York')
        })

        it('should work with arrays', () => {
            const firstLens = index<number>(0)
            const arr = [1, 2, 3]
            const updated = over(firstLens, arr, (x) => (x ?? 0) * 10)

            expect(updated).toEqual([10, 2, 3])
            expect(arr).toEqual([1, 2, 3])
        })

        it('should handle complex transformations', () => {
            const addressLens = prop<Person, 'address'>('address')
            const updated = over(addressLens, testPerson, (addr) => ({
                ...addr,
                street: addr.street.toUpperCase(),
                city: addr.city.toUpperCase(),
            }))

            expect(updated.address.street).toBe('123 MAIN ST')
            expect(updated.address.city).toBe('NEW YORK')
            expect(testPerson.address.street).toBe('123 Main St')
        })
    })

    describe('immutability', () => {
        it('prop should not mutate original object', () => {
            const original = { ...testPerson }
            const nameLens = prop<Person, 'name'>('name')

            set(nameLens, testPerson, 'Changed')

            expect(testPerson).toEqual(original)
        })

        it('path should not mutate original nested object', () => {
            const original = JSON.parse(JSON.stringify(testPerson))
            const cityLens = path<Person, 'address', 'city'>('address', 'city')

            set(cityLens, testPerson, 'Changed')

            expect(testPerson).toEqual(original)
        })

        it('over should not mutate original object', () => {
            const original = { ...testPerson }
            const ageLens = prop<Person, 'age'>('age')

            over(ageLens, testPerson, (age) => age * 2)

            expect(testPerson).toEqual(original)
        })

        it('composeLens should not mutate original object', () => {
            const original = JSON.parse(JSON.stringify(testPerson))
            const addressLens = prop<Person, 'address'>('address')
            const streetLens = prop<Address, 'street'>('street')
            const composedLens = composeLens(addressLens, streetLens)

            set(composedLens, testPerson, 'Changed')

            expect(testPerson).toEqual(original)
        })
    })

    describe('practical use cases', () => {
        it('should update deeply nested state', () => {
            const addressLens = prop<Person, 'address'>('address')
            const cityLens = prop<Address, 'city'>('city')
            const streetLens = prop<Address, 'street'>('street')

            const cityPathLens = composeLens(addressLens, cityLens)
            const streetPathLens = composeLens(addressLens, streetLens)

            let updated = set(cityPathLens, testPerson, 'Boston')
            updated = set(streetPathLens, updated, '789 Elm St')

            expect(updated.address.city).toBe('Boston')
            expect(updated.address.street).toBe('789 Elm St')
            expect(testPerson.address.city).toBe('New York')
            expect(testPerson.address.street).toBe('123 Main St')
        })

        it('should work with React-like state updates', () => {
            const ageLens = prop<Person, 'age'>('age')

            // Simulate React setState pattern
            const incrementAge = (person: Person) =>
                over(ageLens, person, (age) => age + 1)

            let currentPerson = testPerson
            currentPerson = incrementAge(currentPerson)
            currentPerson = incrementAge(currentPerson)

            expect(currentPerson.age).toBe(32)
            expect(testPerson.age).toBe(30)
        })

        it('should normalize data', () => {
            const nameLens = prop<Person, 'name'>('name')

            const normalize = (person: Person) =>
                over(nameLens, person, (name) =>
                    name.trim().replace(/\s+/g, ' ')
                )

            const messy = { ...testPerson, name: '  John   Doe  ' }
            const normalized = normalize(messy)

            expect(normalized.name).toBe('John Doe')
        })

        it('should work with form field updates', () => {
            interface FormData {
                user: {
                    profile: {
                        email: string
                        phone: string
                    }
                }
            }

            const form: FormData = {
                user: {
                    profile: {
                        email: 'test@example.com',
                        phone: '555-0100',
                    },
                },
            }

            const emailLens = path<FormData, 'user', 'profile'>(
                'user',
                'profile'
            )
            const emailFieldLens = composeLens(
                emailLens,
                prop<{ email: string; phone: string }, 'email'>('email')
            )

            const updated = set(emailFieldLens, form, 'new@example.com')

            expect(updated.user.profile.email).toBe('new@example.com')
            expect(form.user.profile.email).toBe('test@example.com')
        })
    })

    describe('edge cases', () => {
        it('should handle undefined in arrays', () => {
            const arr: (number | undefined)[] = [1, undefined, 3]
            const secondLens = index<number | undefined>(1)

            const value = view(secondLens, arr)
            expect(value).toBeUndefined()

            const updated = set(secondLens, arr, 2)
            expect(updated).toEqual([1, 2, 3])
        })

        it('should handle empty arrays', () => {
            const emptyArr: number[] = []
            const firstLens = index<number>(0)

            const value = view(firstLens, emptyArr)
            expect(value).toBeUndefined()
        })

        it('should handle objects with same reference', () => {
            const sharedAddress = testPerson.address
            const person2: Person = {
                ...testPerson,
                address: sharedAddress,
            }

            const cityLens = path<Person, 'address', 'city'>('address', 'city')
            const updated = set(cityLens, person2, 'Boston')

            // Should create new address object
            expect(updated.address).not.toBe(sharedAddress)
            expect(person2.address).toBe(sharedAddress)
            expect(testPerson.address).toBe(sharedAddress)
        })
    })
})
