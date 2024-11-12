import { BaseHero, BaseLayout, MapComponent } from '../components';

BaseLayout

const HomePage = () => {
  return (
    <>
      <BaseLayout>
        <BaseHero />
        <MapComponent />
      </BaseLayout>
    </>
  );
};
export default HomePage;
