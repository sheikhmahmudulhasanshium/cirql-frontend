const FAQ = () => {
  return (
    <div className="w-full px-4 py-12 max-w-4xl mx-auto">
      <h2 className=" font-bold mb-8 text-center text-3xl font-geistSans lg:text-6xl md:text-4xl sm:text-3xl bg-gradient-to-tl from-slate-500 to-yellow-100 dark:from-blue-500 dark:to-cyan-300 text-transparent bg-clip-text py-4 animate-accordion-down">Frequently Asked Questions</h2>

      <div className="space-y-8 text-left text-gray-700 dark:text-gray-300">
        <div>
          <h3 className="text-xl font-semibold mb-2">Is CiRQL free to use?</h3>
          <p className="text-lg">
            Yes! CiRQL is free for individuals and small groups. We also offer premium features for
            larger communities and professional teams—more storage, advanced moderation tools, and deeper
            integrations.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Who can join a CiRQL group?</h3>
          <p className="text-lg">
            CiRQL groups are invite-only by default. Group creators have full control over who gets in,
            what permissions they have, and how the community is structured. You can open access or keep it
            completely private—your call.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">How does CiRQL handle privacy?</h3>
          <p className="text-lg">
            Privacy is core to our mission. We don&apos;t serve ads, sell your data, or track your activity
            for profit. All communication is encrypted, and group data belongs solely to the group.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Can I create multiple groups?</h3>
          <p className="text-lg">
            Absolutely! You can be a member of multiple groups and switch between them seamlessly.
            Each group is fully isolated, allowing you to maintain different contexts for different parts of your life.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">What platforms does CiRQL support?</h3>
          <p className="text-lg">
            Currently, CiRQL is available as a web app and is fully optimized for mobile browsers. Native apps for iOS
            and Android are in development and will be launching soon.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">How can I provide feedback or suggest features?</h3>
          <p className="text-lg">
            We love hearing from our users. You can submit feedback directly through the app or reach out
            to our team via the Contact page. Community feedback helps shape our roadmap!
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ ;
