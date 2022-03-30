const partGroupsdata = [
    {
        id: 1,
        elementIds: [50, 51],
    },
    {
        id: 2,
        elementIds: [52, 53],
    },
    {
        id: 52,
        elementIds: [54, 55],
    },
]

const partInstancesdata = [
    {
        id: 50,
    },
    {
        id: 51,
    },
    {
        id: 54,
    },
    {
        id: 53,
    },
    {
        id: 55,
    },
    {
        id: 1000,
    },
]

const expected = [
    {
        id: 1,
        children: [
            { id: 50, children: [] },
            { id: 51, children: [] },
        ],
    },
    {
        id: 2,
        children: [
            {
                id: 52,
                children: [
                    {
                        id: 54,
                        children: [],
                    },
                    {
                        id: 55,
                        children: [],
                    },
                ],
            },
            {
                id: 53,
                children: [],
            },
        ],
    },
    {
        id: 1000,
        children: [],
    },
]

export function toFakePartGroup(partInstances: typeof partInstancesdata) {
    return partInstances.map<{ id: number; elementIds: number[] }>(
        ({ id }) => ({ id, elementIds: [] })
    )
}

function combineToPartGroups(
    partGroups: typeof partGroupsdata,
    partInstances: typeof partInstancesdata
) {
    return [...partGroups, ...toFakePartGroup(partInstances)]
}

type Testtype = {
    id: number
    children: Testtype[]
}
export function createTree(
    partGroup: { id: number; elementIds: number[] },
    elements: ReturnType<typeof combineToPartGroups>
): Testtype {
    const test = {
        id: partGroup.id,
        children: partGroup.elementIds
            .map((elementId) =>
                elements
                    .filter((element) => element.id === elementId)
                    .map((element) => createTree(element, elements))
            )
            .reduce((prev, acc) => prev.concat(acc), []),
    }

    return test
}
