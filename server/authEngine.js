// server/authEngine.js
// In-Memory User Authentication Engine for MindPulse AI

const usersDb = [
  {
    id: 'user_1',
    name: 'Alex Rivera',
    email: 'demo@mindpulse.ai',
    password: 'password123',
    avatarColor: '#38BDF8',
    createdAt: new Date().toISOString()
  }
];

export function registerUser(name, email, password) {
  if (!name || !email || !password) {
    return { success: false, error: 'Name, email, and password are required.' };
  }

  const existing = usersDb.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return { success: false, error: 'An account with this email address already exists.' };
  }

  const colors = ['#38BDF8', '#34D399', '#818CF8', '#F43F5E', '#F59E0B'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const newUser = {
    id: `user_${Date.now()}`,
    name,
    email: email.toLowerCase(),
    password, // In production, hash with bcrypt
    avatarColor: randomColor,
    createdAt: new Date().toISOString()
  };

  usersDb.push(newUser);

  const token = `mp_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return {
    success: true,
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      avatarColor: newUser.avatarColor
    }
  };
}

export function loginUser(email, password) {
  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  const user = usersDb.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    return { success: false, error: 'Invalid email or password.' };
  }

  const token = `mp_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return {
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarColor: user.avatarColor
    }
  };
}
