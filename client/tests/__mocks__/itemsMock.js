export const itemsMock = [
  {
    authorName: 'John Smith',
    done: false,
    id: '5678',
    name: 'Coffe',
    voterIds: ['abcd', 'efgh']
  },
  {
    authorName: 'Joan Smith',
    done: true,
    id: '9876',
    name: 'Tea',
    voterIds: []
  }
];

export const newItemMock = {
  authorName: 'Marry Smith',
  done: false,
  id: '1234',
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
        done: false,
        id: '1234',
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
        done: true,
        id: '1234',
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
        done: false,
        id: '1234',
        name: 'Sugar',
        voterIds: ['abcd', 'efgh', 'ijkl']
      }
    ]
  }
};
