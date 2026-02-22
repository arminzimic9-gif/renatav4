import React from 'react';

export interface NavItem {
  label: string;
  path: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  target: string;
  format: string;
  icon: React.ReactNode;
}

export interface Testimonial {
  id: string;
  text: string;
  author: string;
  role: string;
}

export interface Stat {
  value: string;
  label: string;
}