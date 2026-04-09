import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { Loader2, X, Save, Sparkles, Wand2 } from 'lucide-react';
import { toast } from 'sonner';

interface AdminPostEditorProps {
  post?: any;
  onClose: () => void;
}

export default function AdminPostEditor({ post, onClose }: AdminPostEditorProps) {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [categoryId, setCategoryId] = useState(post?.categoryId || 0);
  const [status, setStatus] = useState(post?.status || 'draft');
  const [featuredImage, setFeaturedImage] = useState(post?.featuredImage || '');
  const [imdbReference, setImdbReference] = useState(post?.imdbReference || '');
  const [affiliateLinks, setAffiliateLinks] = useState(post?.affiliateLinks || '[]');
  const [metaDescription, setMetaDescription] = useState(post?.metaDescription || '');
  const [metaKeywords, setMetaKeywords] = useState(post?.metaKeywords || '');
  const [showLLMMenu, setShowLLMMenu] = useState(false);
  const [llmLoading, setLLMLoading] = useState(false);

  const { data: categories } = trpc.categories.getAll.useQuery();
  const createPostMutation = trpc.posts.create.useMutation();
  const updatePostMutation = trpc.posts.update.useMutation();
  const generateReviewMutation = trpc.llmAssistant.generateReview.useMutation();
  const generateSummaryMutation = trpc.llmAssistant.generateSummary.useMutation();
  const generateSEOMutation = trpc.llmAssistant.generateSEO.useMutation();
  const improveContentMutation = trpc.llmAssistant.improveContent.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || categoryId === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (post?.id) {
        await updatePostMutation.mutateAsync({
          id: post.id,
          title,
          content,
          excerpt,
          categoryId,
          status,
          featuredImage,
          imdbReference,
          affiliateLinks,
          metaDescription,
          metaKeywords,
        });
        toast.success('Post updated successfully');
      } else {
        await createPostMutation.mutateAsync({
          title,
          content,
          excerpt,
          categoryId,
          status,
          featuredImage,
          imdbReference,
          affiliateLinks,
          metaDescription,
          metaKeywords,
        });
        toast.success('Post created successfully');
      }
      onClose();
    } catch (error) {
      toast.error('Failed to save post');
    }
  };

  const handleGenerateReview = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title first');
      return;
    }
    setLLMLoading(true);
    try {
      const result = await generateReviewMutation.mutateAsync({
        title,
        context: excerpt || 'Anime and movie review',
      });
      if (result.success && result.content) {
        setContent(result.content);
        toast.success('Review generated successfully');
      } else {
        toast.error(result.error || 'Failed to generate review');
      }
    } catch (error) {
      toast.error('Failed to generate review');
    } finally {
      setLLMLoading(false);
      setShowLLMMenu(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please enter title and content first');
      return;
    }
    setLLMLoading(true);
    try {
      const result = await generateSummaryMutation.mutateAsync({
        title,
        content,
      });
      if (result.success && result.content) {
        setExcerpt(result.content);
        toast.success('Summary generated successfully');
      } else {
        toast.error(result.error || 'Failed to generate summary');
      }
    } catch (error) {
      toast.error('Failed to generate summary');
    } finally {
      setLLMLoading(false);
      setShowLLMMenu(false);
    }
  };

  const handleGenerateSEO = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please enter title and content first');
      return;
    }
    setLLMLoading(true);
    try {
      const result = await generateSEOMutation.mutateAsync({
        title,
        content,
      });
      if (result.success && result.content) {
        try {
          const seoData = JSON.parse(result.content);
          setMetaDescription(seoData.metaDescription || '');
          setMetaKeywords(seoData.keywords?.join(', ') || '');
          toast.success('SEO content generated successfully');
        } catch {
          setMetaDescription(result.content);
          toast.success('SEO content generated (check manually)');
        }
      } else {
        toast.error(result.error || 'Failed to generate SEO content');
      }
    } catch (error) {
      toast.error('Failed to generate SEO content');
    } finally {
      setLLMLoading(false);
      setShowLLMMenu(false);
    }
  };

  const handleImproveContent = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please enter title and content first');
      return;
    }
    setLLMLoading(true);
    try {
      const result = await improveContentMutation.mutateAsync({
        title,
        content,
      });
      if (result.success && result.content) {
        setContent(result.content);
        toast.success('Content improved successfully');
      } else {
        toast.error(result.error || 'Failed to improve content');
      }
    } catch (error) {
      toast.error('Failed to improve content');
    } finally {
      setLLMLoading(false);
      setShowLLMMenu(false);
    }
  };

  const isLoading = createPostMutation.isPending || updatePostMutation.isPending || llmLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-orbitron text-2xl font-bold text-neon-magenta">
          {post ? 'EDIT POST' : 'CREATE NEW POST'}
        </h2>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLLMMenu(!showLLMMenu)}
              disabled={llmLoading}
              className="border-neon-magenta text-neon-magenta hover:bg-neon-magenta/10 font-orbitron"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI ASSIST
            </Button>
            {showLLMMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-black border border-neon-cyan rounded shadow-lg z-10">
                <button
                  onClick={handleGenerateReview}
                  disabled={llmLoading}
                  className="w-full text-left px-4 py-2 hover:bg-neon-cyan/20 text-neon-cyan text-sm font-space-mono border-b border-neon-cyan/20"
                >
                  <Wand2 className="w-3 h-3 inline mr-2" />
                  GENERATE REVIEW
                </button>
                <button
                  onClick={handleGenerateSummary}
                  disabled={llmLoading}
                  className="w-full text-left px-4 py-2 hover:bg-neon-cyan/20 text-neon-cyan text-sm font-space-mono border-b border-neon-cyan/20"
                >
                  <Wand2 className="w-3 h-3 inline mr-2" />
                  GENERATE SUMMARY
                </button>
                <button
                  onClick={handleGenerateSEO}
                  disabled={llmLoading}
                  className="w-full text-left px-4 py-2 hover:bg-neon-cyan/20 text-neon-cyan text-sm font-space-mono border-b border-neon-cyan/20"
                >
                  <Wand2 className="w-3 h-3 inline mr-2" />
                  GENERATE SEO
                </button>
                <button
                  onClick={handleImproveContent}
                  disabled={llmLoading}
                  className="w-full text-left px-4 py-2 hover:bg-neon-cyan/20 text-neon-cyan text-sm font-space-mono"
                >
                  <Wand2 className="w-3 h-3 inline mr-2" />
                  IMPROVE CONTENT
                </button>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-neon-magenta"
          >
            <X size={20} />
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <Card className="p-6 border-neon-cyan/30">
          <label className="font-orbitron font-bold text-neon-cyan mb-2 block">TITLE *</label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-input border-neon-cyan/30 focus:border-neon-cyan font-space-mono text-sm"
            required
          />
        </Card>

        {/* Category */}
        <Card className="p-6 border-neon-magenta/30">
          <label className="font-orbitron font-bold text-neon-magenta mb-2 block">CATEGORY *</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            className="w-full px-3 py-2 bg-input border border-neon-magenta/30 focus:border-neon-magenta rounded-sm font-space-mono text-sm focus:outline-none"
            required
          >
            <option value={0}>SELECT CATEGORY</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </Card>

        {/* Content */}
        <Card className="p-6 border-neon-green/30">
          <label className="font-orbitron font-bold text-neon-green mb-2 block">CONTENT *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 bg-input border border-neon-green/30 focus:border-neon-green rounded-sm font-space-mono text-sm focus:outline-none min-h-64"
            required
          />
          <p className="font-space-mono text-xs text-muted-foreground mt-2">
            Markdown formatting supported
          </p>
        </Card>

        {/* Excerpt */}
        <Card className="p-6 border-neon-cyan/30">
          <label className="font-orbitron font-bold text-neon-cyan mb-2 block">EXCERPT</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full p-3 bg-input border border-neon-cyan/30 focus:border-neon-cyan rounded-sm font-space-mono text-sm focus:outline-none min-h-20"
          />
        </Card>

        {/* Featured Image */}
        <Card className="p-6 border-neon-magenta/30">
          <label className="font-orbitron font-bold text-neon-magenta mb-2 block">FEATURED IMAGE URL</label>
          <Input
            type="url"
            value={featuredImage}
            onChange={(e) => setFeaturedImage(e.target.value)}
            className="bg-input border-neon-magenta/30 focus:border-neon-magenta font-space-mono text-sm"
            placeholder="https://example.com/image.jpg"
          />
        </Card>

        {/* IMDb Reference */}
        <Card className="p-6 border-neon-green/30">
          <label className="font-orbitron font-bold text-neon-green mb-2 block">IMDB REFERENCE</label>
          <Input
            type="text"
            value={imdbReference}
            onChange={(e) => setImdbReference(e.target.value)}
            className="bg-input border-neon-green/30 focus:border-neon-green font-space-mono text-sm"
            placeholder="tt1234567 or IMDb URL"
          />
        </Card>

        {/* Affiliate Links */}
        <Card className="p-6 border-neon-cyan/30">
          <label className="font-orbitron font-bold text-neon-cyan mb-2 block">AFFILIATE LINKS (JSON)</label>
          <textarea
            value={affiliateLinks}
            onChange={(e) => setAffiliateLinks(e.target.value)}
            className="w-full p-3 bg-input border border-neon-cyan/30 focus:border-neon-cyan rounded-sm font-space-mono text-xs focus:outline-none min-h-24"
            placeholder='[{"platform":"Netflix","url":"https://...","price":"9.99"}]'
          />
        </Card>

        {/* SEO */}
        <Card className="p-6 border-neon-magenta/30">
          <h3 className="font-orbitron font-bold text-neon-magenta mb-4">SEO SETTINGS</h3>
          <div className="space-y-4">
            <div>
              <label className="font-space-mono text-xs text-muted-foreground mb-2 block">META DESCRIPTION</label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full p-2 bg-input border border-neon-magenta/30 focus:border-neon-magenta rounded-sm font-space-mono text-xs focus:outline-none min-h-16"
                maxLength={160}
              />
              <p className="font-space-mono text-xs text-muted-foreground mt-1">
                {metaDescription.length}/160 characters
              </p>
            </div>
            <div>
              <label className="font-space-mono text-xs text-muted-foreground mb-2 block">META KEYWORDS</label>
              <Input
                type="text"
                value={metaKeywords}
                onChange={(e) => setMetaKeywords(e.target.value)}
                className="bg-input border-neon-magenta/30 focus:border-neon-magenta font-space-mono text-xs"
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </div>
        </Card>

        {/* Status */}
        <Card className="p-6 border-neon-green/30">
          <label className="font-orbitron font-bold text-neon-green mb-2 block">STATUS</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="draft"
                checked={status === 'draft'}
                onChange={(e) => setStatus(e.target.value)}
                className="w-4 h-4"
              />
              <span className="font-space-mono text-sm">DRAFT</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="published"
                checked={status === 'published'}
                onChange={(e) => setStatus(e.target.value)}
                className="w-4 h-4"
              />
              <span className="font-space-mono text-sm">PUBLISHED</span>
            </label>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-neon-cyan text-background hover:bg-neon-green font-orbitron font-bold py-6"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                SAVING...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                {post ? 'UPDATE POST' : 'CREATE POST'}
              </>
            )}
          </Button>
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="flex-1 border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-background font-orbitron font-bold py-6"
          >
            CANCEL
          </Button>
        </div>
      </form>
    </div>
  );
}
