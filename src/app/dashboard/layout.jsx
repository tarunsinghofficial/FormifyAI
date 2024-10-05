'use client'
import React from 'react';
import SideNav from './components/SideNav';
import { SidebarProvider } from '../contexts/SidebarContext'; 
import { useSidebar } from '../contexts/SidebarContext.jsx'

const Content = ({ children }) => {
  const { open } = useSidebar();
  return (
    <div className={`${open ? 'ml-0' : ''} transition-all duration-300 bg-[#EFF3F4] w-full overflow-x-scroll`}>
      {children}
    </div>
  );
};

const DashboardLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <div className='flex h-screen mt-16'>
        <SideNav />
        <Content>{children}</Content>
      </div>
    </SidebarProvider>
  );
}

export default DashboardLayout;
