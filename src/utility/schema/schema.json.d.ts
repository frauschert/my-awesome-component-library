declare const schema: {
    "PriorityEnum": {
        "type": "enum",
        "description": "Specifies priorities.",
        "items": [
            {
                "name": "Low",
                "value": "0",
                "gui": { "label": "Low" }
            },
            {
                "name": "Medium",
                "value": "1",
                "gui": { "label": "Medium" }
            },
            {
                "name": "High",
                "value": "2",
                "gui": { "label": "High" }
            },
            {
                "name": "Critical",
                "value": "3",
                "gui": { "label": "Critical" }
            }
        ]
    },
    "SomeElement": {
        "type": "class",
        "description": "Defines an element",
        "gui": {
            "label": "Element"
        },
        "properties": {
            "name": {
                "description": "The name",
                "type": "string",
                "gui": {
                    "label": "Name"
                }
            }
        }
    },
    "Instance": {
        "type": "class",
        "description": "Defines an instance",
        "base": {
            "$ref": "SomeElement"
        },
        "gui": {
            "label": "Instance"
        },
        "properties": {
            "someId": {
                "description": "References another schema",
                "type": "id",
                "default": -1,
                "item": {
                    "$ref": "AnotherClass"
                },
                "gui": {
                    "label": "Identifier of AnotherClass",
                    "hidden": {
                        "default": true
                    }
                }
            },
            "someUnsignedInteger": {
                "description": "",
                "type": "UInt32",
                "default": 0,
                "unit": "°",
                "unitScale": 1e-3,
                "readonly": true,
                "gui": {
                    "label": "Some Unsigned Integer",
                    "unit": "°",
                    "unitScale": 1,
                    "decimalPlace": 2
                }
            },
            "index": {
                "description": "",
                "type": "Int32",
                "readonly": true,
                "default": -1,
                "gui": {
                    "label": "Index"
                }
            },
            "priority": {
                "type": "Int32",
                "description": "Priority",
                "default": 0,
                "validation": {
                    "min": 0
                },
                "readonly": true
            }
        }
    }
}; export default schema;
