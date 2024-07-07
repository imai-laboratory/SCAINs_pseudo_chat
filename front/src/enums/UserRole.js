const UserRole = {
  ADMIN: 0,
  USER: 1,
};

const userRoleLabels = {
  [UserRole.ADMIN]: '管理者',
  [UserRole.USER]: 'ユーザー',
};

export { UserRole, userRoleLabels };