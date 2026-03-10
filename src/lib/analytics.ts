// GTM dataLayer analytics utility

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

window.dataLayer = window.dataLayer || [];

const pushEvent = (event: string, params: Record<string, unknown> = {}) => {
  window.dataLayer.push({ event, ...params });
};

// Step viewed
export const trackStepView = (step: number, stepName: string) => {
  pushEvent('wizard_step_view', {
    wizard_step: step,
    wizard_step_name: stepName,
  });
};

// User made a selection within a step
export const trackSelection = (step: number, stepName: string, selectionKey: string, selectionValue: string | number) => {
  pushEvent('wizard_selection', {
    wizard_step: step,
    wizard_step_name: stepName,
    selection_key: selectionKey,
    selection_value: selectionValue,
  });
};

// Wizard completed – reached results
export const trackWizardComplete = (selections: Record<string, unknown>) => {
  pushEvent('wizard_complete', {
    ...selections,
  });
};

// User clicked a recommended product
export const trackProductClick = (productName: string, position: 'primary' | 'secondary') => {
  pushEvent('wizard_product_click', {
    product_name: productName,
    product_position: position,
  });
};

// User restarted the wizard
export const trackRestart = () => {
  pushEvent('wizard_restart');
};

// Drop-off: fired on page unload if wizard not completed
let wizardCompleted = false;

export const markWizardCompleted = () => {
  wizardCompleted = true;
};

export const trackDropOff = (currentStep: number, stepName: string) => {
  if (wizardCompleted) return;
  // Use sendBeacon-compatible approach
  pushEvent('wizard_drop_off', {
    wizard_step: currentStep,
    wizard_step_name: stepName,
  });
};

export const resetWizardCompletion = () => {
  wizardCompleted = false;
};
