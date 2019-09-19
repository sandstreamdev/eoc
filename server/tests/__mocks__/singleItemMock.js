const singleItemMock = [
  {
    _id: { $oid: '5ccd61174663533f995b1758' },
    authorId: {
      _id: '5c9dc5a619ae7924074940f4',
      displayName: 'John Doe'
    },
    createdAt: { $date: { $numberLong: '1556963607250' } },
    description: '',
    done: false,
    isArchived: false,
    name: 'Coffee',
    updatedAt: { $date: { $numberLong: '1556963607250' } },
    voterIds: []
  }
];

module.exports = { singleItemMock };
