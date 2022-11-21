import { Router } from 'express';
import { ControllerPaths } from '../../paths';

export interface IController {
  path: ControllerPaths;
  router: Router;
}
