

export { default as productsController } from './productsController';
export { default as servicesController } from './servicesController';
export { default as demoController } from './demoController';
export { default as pricingController } from './pricingController';
export { default as teamController } from './teamController';


import productsController from './productsController';
import servicesController from './servicesController';
import demoController from './demoController';
import pricingController from './pricingController';
import teamController from './teamController';

const controllers = {
  products: productsController,
  services: servicesController,
  demo: demoController,
  pricing: pricingController,
  team: teamController,
};

export default controllers;
