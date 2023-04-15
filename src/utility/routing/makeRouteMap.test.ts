import { makeNavigate, makeRouteMap } from './makeRouteMap'

describe('makeRouteMap', () => {
    it('Should create simple routes as expected', () => {
        const routeMap = makeRouteMap({
            index: '/',
            admin: '/admin',
        })

        expect(routeMap.index()).toEqual('/')
        expect(routeMap.admin()).toEqual('/admin')
    })
    it('Should handle path params', () => {
        const routeMap = makeRouteMap({
            editUser: '/users/:id/edit',
        })
        expect(
            routeMap.editUser({
                id: 240,
            })
        ).toEqual('/users/240/edit')
    })
})

describe('makeNavigate', () => {
    it('Should call the navigate function with the route you provide', () => {
        const pushToHistory = jest.fn()
        const navigate = makeNavigate(
            {
                editUser: '/users/:id/edit',
            },
            pushToHistory
        )

        navigate.editUser({
            id: 240,
        })

        expect(pushToHistory).toHaveBeenCalledWith('/users/240/edit')
    })
})
