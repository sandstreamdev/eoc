export const productsMock = [
  {
    authorName: 'John Smith',
    id: '5678',
    isOrdered: false,
    name: 'Coffe',
    voterIds: ['abcd', 'efgh']
  },
  {
    authorName: 'Joan Smith',
    id: '9876',
    isOrdered: true,
    name: 'Tea',
    voterIds: []
  }
];

export const newProductMock = {
  authorName: 'Marry Smith',
  id: '1234',
  isOrdered: false,
  name: 'Sugar',
  voterIds: ['abcd', 'efgh']
};

export const shoppingListMockNotPopulated = {
  1234: {
    listId: '1234',
    products: []
  }
};

export const shoppingListMockPopulated = {
  1234: {
    listId: '1234',
    products: [
      {
        authorName: 'Marry Smith',
        id: '1234',
        isOrdered: false,
        name: 'Sugar',
        voterIds: ['abcd', 'efgh']
      }
    ]
  }
};

export const shoppingListMockProductToggled = {
  1234: {
    listId: '1234',
    products: [
      {
        authorName: 'Marry Smith',
        id: '1234',
        isOrdered: true,
        name: 'Sugar',
        voterIds: ['abcd', 'efgh']
      }
    ]
  }
};

export const shoppingListMockProductVoted = {
  1234: {
    listId: '1234',
    products: [
      {
        authorName: 'Marry Smith',
        id: '1234',
        isOrdered: false,
        name: 'Sugar',
        voterIds: ['abcd', 'efgh', 'ijkl']
      }
    ]
  }
};
