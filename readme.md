# Corpus monodicum Data Converter


![GitHub](https://img.shields.io/github/license/timeipert/cm-converter)

In the future, the tool should allow various format conversions related to Corpus monodicum to make the data accessible to various already existing tools.
Monodi+, a software developed by CM for editing monophonic notation, relies on a JSON format highly oriented to the latest MEI specification. The decoupling of monodi+ and the current MEI version is due to the unclear nature of the MEI Neumes Module evolution. Another reason is that only a small part of the MEI specification is necessary for the kind of representation convention in Corpus monodicum.




## Test Usage
```Shell
npm run convert i=examples o=out type=GABC
```
Files in 'examples' folder have to be named data.json by default (this will be more flexible in the future).

For MEI conversion:
```Shell
npm run convert i=examples o=out type=MEI
```

## Result

Just GABC (and a little bit MEI) and all work in progress!
It converts a monodi+ json file like this:
```json
{
  "kind": "RootContainer",
  "uuid": "515d789e-2a98-41fa-83ce-ab1158064e64",
  "children": [
    {
      "uuid": "02dc64f8-77fa-4ca0-90ef-7d25d64811cf",
      "kind": "FormteilContainer",
      "children": [
        {
          "uuid": "db3f67d7-31df-40f6-bddf-ea3adedabd70",
          "kind": "ZeileContainer",
          "children": [
            {
              "uuid": "b1f8fa1a-518b-4b5d-ae20-b71f7e2592cc",
              "kind": "Syllable",
              "text": "A-",
              "syllableType": "Normal",
              "notes": {
                "spaced": [
                  {
                    "nonSpaced": [
                      {
                        "grouped": [
                          {
                            "uuid": "c8758034-2c83-4ea2-a3bf-7842d08d5df4",
                            "base": "A",
                            "liquescent": false,
                            "noteType": "Normal",
                            "octave": 4,
                            "focus": false
                          },
                          {
                            "uuid": "3be915da-c63c-46b7-b9af-2ac9eb492b40",
                            "base": "B",
                            "liquescent": false,
                            "noteType": "Normal",
                            "octave": 4,
                            "focus": false
                          }
                        ]
                      },
                      {
                        "grouped": [
                          {
                            "uuid": "8975e1f4-5874-4ca3-9644-f289465b49a5",
                            "base": "B",
                            "liquescent": false,
                            "noteType": "Normal",
                            "octave": 4,
                            "focus": false
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            },
            {
              "uuid": "72106bc7-904b-4c1e-af19-776f2e9c7187",
              "kind": "Syllable",
              "text": "men",
              "syllableType": "Normal",
              "notes": {
                "spaced": [
                  {
                    "nonSpaced": [
                      {
                        "grouped": [
                          {
                            "uuid": "43ea6646-2785-41b2-b5af-3ccb6654279a",
                            "base": "G",
                            "octave": 4,
                            "noteType": "Normal",
                            "focus": false,
                            "liquescent": false
                          },
                          {
                            "uuid": "340e7fca-9ca4-407f-bd4d-be45c072235d",
                            "base": "A",
                            "octave": 4,
                            "noteType": "Normal",
                            "focus": false,
                            "liquescent": false
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "nonSpaced": [
                      {
                        "grouped": [
                          {
                            "uuid": "84c612f1-c1c1-40c0-a93f-51cf7e63288b",
                            "base": "A",
                            "octave": 4,
                            "noteType": "Normal",
                            "focus": false,
                            "liquescent": false
                          }
                        ]
                      },
                      {
                        "grouped": [
                          {
                            "uuid": "12971939-b62d-4807-91dd-4a962f7789ee",
                            "base": "G",
                            "octave": 4,
                            "noteType": "Normal",
                            "focus": false,
                            "liquescent": false
                          }
                        ]
                      },
                      {
                        "grouped": [
                          {
                            "uuid": "9471e2d7-c1d9-45cc-aba8-378a929829e8",
                            "base": "F",
                            "octave": 4,
                            "noteType": "Normal",
                            "focus": true,
                            "liquescent": false
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            }
          ]
        }
      ],
      "data": [
        {
          "name": "Signatur",
          "data": ""
        }
      ]
    }
  ],
  "comments": [],
  "documentType": "Level1"
}
```

into gabc notation:

```
(c3)
A(fg/g)men(ef//f/e/d) 
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
