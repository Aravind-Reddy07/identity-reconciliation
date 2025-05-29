export const getPrimaryContact = (contacts) => {
  return contacts.reduce((prev, curr) =>
    new Date(prev.createdAt) < new Date(curr.createdAt) ? prev : curr
  );
};
