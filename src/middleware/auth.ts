import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export const authenticate = (req: NextRequest) => {
  const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return null;
  }
  
  return verifyToken(token);
};

export const requireAuth = (handler: Function) => {
  return async (req: NextRequest, context?: any) => {
    const user = authenticate(req);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    return handler(req, context, user);
  };
};

export const requireRole = (roles: string[], handler: Function) => {
  return async (req: NextRequest, context?: any) => {
    const user = authenticate(req);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!roles.includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    return handler(req, context, user);
  };
};
