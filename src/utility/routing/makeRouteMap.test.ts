import { makeRouteMap } from './makeRouteMap'

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
