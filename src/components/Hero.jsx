

const Hero = () => {
  return (
    <section className="relative h-[60vh] overflow-hidden">
      
      <video
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/assets/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>


      
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to DecoraNest</h1>
        <p className="text-lg mb-6">Find your perfect touch of elegance & comfort</p>
       
      </div>
    </section>
  );
};

export default Hero;

