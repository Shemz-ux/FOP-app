import { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import ScrollReveal from '../../components/ScrollReveal';

export default function Contact() {
  const [formData, setFormData] = useState({
    email: '',
    topic: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL 
      const response = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      setSuccess(true);
      setFormData({ email: '', topic: '', message: '' });
      
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-primary/20 via-primary/5 to-background border-b border-border overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container mx-auto px-6 py-20 lg:py-15 relative">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm mb-6">
                <Mail className="w-4 h-4" />
                <span>Get in Touch</span>
              </div>

              <h1 className="text-4xl lg:text-6xl mb-6 text-foreground">
                Contact <span className="text-primary">Us</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Have a question or want to learn more? We'd love to hear from you.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <ScrollReveal>
              <div className="bg-card border border-border rounded-2xl p-8 lg:p-12 shadow-lg text-left">
                <h2 className="text-2xl mb-6 text-foreground">Send us a message</h2>

                {success && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-green-800 dark:text-green-200 font-medium">Message sent successfully!</p>
                      <p className="text-green-700 dark:text-green-300 text-sm mt-1">We'll get back to you as soon as possible.</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-800 dark:text-red-200">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Your Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <div>
                    <label htmlFor="topic" className="block text-sm font-medium text-foreground mb-2">
                      Topic <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="topic"
                      name="topic"
                      value={formData.topic}
                      onChange={handleChange}
                      required
                      maxLength={100}
                      placeholder="What's this about?"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.topic.length}/100 characters
                    </p>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      maxLength={2000}
                      rows={8}
                      placeholder="Tell us more..."
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.message.length}/2000 characters
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !formData.email.trim() || !formData.topic.trim() || !formData.message.trim()}
                    className="w-full px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="mt-12 text-center">
                <p className="text-muted-foreground mb-4">Or reach us directly at:</p>
                <a
                  href="mailto:info@foperspectives.co.uk"
                  className="text-primary hover:underline text-lg font-medium"
                >
                  info@foperspectives.co.uk
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
