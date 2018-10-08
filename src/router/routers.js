import sysRouter from './sysRouter/index';
import baseRouter from './baseRouter/index';

const fnSetFix = routers => {
  routers.forEach(p => {
    p.isFix = true;
    fnSetFix(p.children || []);
  });
};
fnSetFix(baseRouter || []);
export default [...sysRouter, ...baseRouter];
