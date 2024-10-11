import { BaseHero, BaseLayout, MapComponent } from '../components';

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
