export const itemsMock = [
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

export const newItemMock = {
  authorName: 'Marry Smith',
  id: '1234',
  isOrdered: false,
  name: 'Sugar',
  voterIds: ['abcd', 'efgh']
};

export const listMockNotPopulated = {
  1234: {
    listId: '1234',
    items: []
  }
};

export const listMockPopulated = {
  1234: {
    listId: '1234',
    items: [
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

export const listMockItemToggled = {
  1234: {
    listId: '1234',
    items: [
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

export const listMockItemVoted = {
  1234: {
    listId: '1234',
    items: [
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
