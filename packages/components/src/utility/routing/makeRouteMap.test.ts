import { makeNavigate, makeRouteMap } from './makeRouteMap'

describe('makeRouteMap', () => {
    it('Should create simple routes as expected', () => {
        const routeMap = makeRouteMap({
            index: { path: '/' },
            admin: {
                path: '/admin',
            },
        })

        expect(routeMap.index.path).toEqual('/')
        expect(routeMap.admin.path).toEqual('/admin')
    })
    it('Should handle path params', () => {
        const routeMap = makeRouteMap({
            editUser: { path: '/users/:id/edit' },
        })
        expect(routeMap.editUser.path).toEqual('/users/:id/edit')
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
