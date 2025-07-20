import { ArrowRight } from "lucide-react";
import Link from "next/link";

const CTASection = () => {
  return (
    <section className="relative z-10 px-4 sm:px-6 py-16 sm:py-20 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-3xl px-6 py-10 sm:px-12 sm:py-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-5 sm:mb-6">
            Ready to Explore Mars?
          </h2>
          <p className="text-base sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of researchers, engineers, and space enthusiasts
            monitoring Mars missions through our advanced dashboard platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <button className="cursor-pointer bg-gradient-to-r from-orange-500 to-red-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 flex items-center justify-center space-x-2 group">
                <span>Launch Dashboard</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
