import TourComponent from '../components/MapComponent/Common/TourComponent/TourDetailsComponent';

const tourOptions = {
  styles: {
    badge: (base) => ({ ...base, display: 'none' }),
    controls: (base) => ({
      ...base,
      display: 'none',
    }),
    close: (base) => ({
      ...base,
      color: '#fff',
    }),
  },
  position: 'right',
};

const steps = [
  {
    ...tourOptions,
    selector: '[data-tut="reactour__layers"]',
    content: ({ setCurrentStep }) => (
      <TourComponent
        heading="Categories"
        content="Data for the layers can be filtered by toggling between these four categories."
        skipBtnAction={() => setCurrentStep((currentStep) => currentStep + 1)}
        currentStep={1}
        nextBtnAction={() => setCurrentStep((currentStep) => currentStep + 1)}
      />
    ),
  },

  {
    ...tourOptions,
    selector: '[data-tut="reactour__radio-btn"]',
    content: ({ setCurrentStep }) => (
      <TourComponent
        heading="Layers"
        content="You can filter your search for relevant data by the layer you're interested in."
        skipBtnAction={() => setCurrentStep((currentStep) => currentStep + 1)}
        currentStep={2}
        nextBtnAction={() => setCurrentStep((currentStep) => currentStep + 1)}
      />
    ),
    position: 'right',
  },

  {
    ...tourOptions,
    selector: '[data-tut="reactour__radio-btn-layer"]',
    content: ({ setCurrentStep }) => (
      <TourComponent
        heading="Layer"
        content="By selecting the eye icon, you can choose to hide the layer; by clicking the download icon, you can save the file to your device; and by clicking the information icon, you can learn more about the layer."
        skipBtnAction={() => setCurrentStep((currentStep) => currentStep + 1)}
        currentStep={3}
        nextBtnAction={() => setCurrentStep((currentStep) => currentStep + 1)}
      />
    ),
    position: [400, 380],
  },

  {
    ...tourOptions,
    selector: '[data-tut="reactour__legend"]',
    content: ({ setCurrentStep }) => (
      <TourComponent
        heading="Layer"
        content="The valueof the layer, date, and location are all included in this tile. By selecting the palette icon, you can replace the current color scale with one of your own choosing."
        skipBtnAction={() => setCurrentStep((currentStep) => currentStep + 1)}
        currentStep={4}
        nextBtnAction={() => setCurrentStep((currentStep) => currentStep + 1)}
      />
    ),
    position: 'right',
  },
];

export default steps;
