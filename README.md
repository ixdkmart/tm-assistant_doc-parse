Semantic Knowlegebase Extractor


AS OF 11/11/25

KNOWN ISSUES

1. Enrichment speed 
    1. it compares an AKO with every single document. 

```jsx
Currently 1m 20s per AKO
```



2. Atomising duplicates
    1. pulls out AKOs per specific document

```jsx
//AKO #1 entity_store-manager.json
{
  "type": "entity",
  "name": "Store Manager",
  "description": "Responsible for providing guidance when team members are uncertain.",
  "pseudonyms": [
    "Manager",
    "Supervisor in charge"
  ]
}
```

```jsx
//AKO #2 entity_store-manager-2.json
{
  "type": "entity",
  "name": "Store Manager",
  "pseudonyms": [
    "Manager",
    "Store Managers"
  ]
}
```



3. Tunnel vision description
    1. Takes in the first definition of an object that may not be the it’s general meaning 

```json
{
  "type": "entity",
  "name": "Manager",
  "description": "Leads or facilitates the Take Care Talk at the start of the team huddle.",
  "pseudonyms": [
    "Supervisor"
  ]
}
```
