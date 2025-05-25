const About = () => {
  return (
    <div className="w-full px-4 py-12 max-w-4xl">
      <div className="text-left mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-center">About CiRQL</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            CiRQL exists to help people connect more meaningfully in private spaces. In a world of
            overwhelming feeds, endless noise, and impersonal communication, we believe there&apos;s a better
            way to stay connected—with the people and topics that actually matter to you.
          </p>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
            We&apos;re on a mission to reimagine social interaction—less broadcasting, more belonging.
            Whether you&apos;re building a niche interest group, managing a team, or staying close to friends,
            CiRQL gives you the tools to create tight-knit communities with intention.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">What is CiRQL?</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            CiRQL is a private, invite-only communication platform where you can build groups that feel
            like home. Unlike traditional social platforms, CiRQL is built from the ground up to support
            focused, high-quality interaction in a distraction-free environment.
          </p>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
            Here&apos;s what makes CiRQL different:
          </p>
          <ul className="list-disc list-inside mt-4 text-lg text-gray-700 dark:text-gray-300 space-y-2">
            <li><strong>Secure Voice Channels:</strong> Real-time voice communication that&apos;s crystal clear and protected.</li>
            <li><strong>Dynamic Text Chat:</strong> Threaded, organized, and responsive chat designed for deeper conversations.</li>
            <li><strong>Dedicated Groups:</strong> Build spaces around specific interests or teams with full control over structure and access.</li>
            <li><strong>Privacy Focused:</strong> Your data, your groups—no ads, no tracking, no noise.</li>
            <li><strong>Smart Notifications:</strong> Stay in the loop without feeling overwhelmed. You decide what&apos;s important.</li>
            <li><strong>Customizable Roles:</strong> Assign permissions and roles to manage your group&apos;s flow and security.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Join Us</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Whether you&apos;re starting a mastermind group, running a private club, or just want a better
            place for your friends to hang out, CiRQL gives you the space to build your own community—
            your way.
          </p>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
            We&apos;re constantly evolving, guided by community feedback and a commitment to simplicity and
            security. Join CiRQL today and discover what it means to truly stay in the loop.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
