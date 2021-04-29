const TableItem = ({ fullName, yearOfBirth, role, email }) => {
  return (
    <tr>
      <td>{fullName}</td>
      <td>{yearOfBirth}</td>
      <td>{role}</td>
      <td>{email}</td>
    </tr>
  );
};

export default TableItem;
