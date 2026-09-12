import React, { useState, useEffect } from 'react';
import { Sparkles, Send, Eye, PenLine, Building2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import { useApp } from '../../context/AppContext';
import { usePost } from '../../hooks/usePost';

import TopicInput from './TopicInput';
import ImageUpload from './ImageUpload';
import GenerateButton from './GenerateButton';
import ContentEditor from './ContentEditor';
import TargetSelector from '../common/TargetSelector';
import PostPreview from '../common/PostPreview';
import LoadingOverlay from '../common/LoadingOverlay';
import ResultsPopup from '../common/ResultsPopup';
import ConfirmDialog from '../common/ConfirmDialog';

export const CreateContent = () => {
  const { pages, groups } = useApp();
  const {
    isPosting,
    isGenerating,
    postingProgress,
    lastResults,
    setLastResults,
    generate,
    post,
  } = usePost();

  // State
  const [selectedCompany, setSelectedCompany] = useState('');
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [tone, setTone] = useState('professional');
  const [image, setImage] = useState(null);
  const [content, setContent] = useState('');

  // Targets
  const [selectedPages, setSelectedPages] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);

  // Modals & UI dialogs
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);

  // Initialize selected company from available pages
  useEffect(() => {
    if (pages.length > 0 && !selectedCompany) {
      setSelectedCompany(pages[0].name);
    }
  }, [pages, selectedCompany]);

  // Handle AI generation
  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic or prompt for the post.');
      return;
    }

    const result = await generate(topic, selectedCompany, notes, tone);
    if (result?.content) {
      setContent(result.content);
    }
  };

  // Reset form
  const handleResetForm = () => {
    setTopic('');
    setNotes('');
    setContent('');
    setImage(null);
    setSelectedPages([]);
    setSelectedGroups([]);
  };

  // Confirm discard
  const handleConfirmDiscard = () => {
    setContent('');
    setImage(null);
    setShowDiscardDialog(false);
    toast.success('Draft discarded.');
  };

  // Trigger publish confirmation
  const handleInitiatePublish = () => {
    if (!content.trim()) {
      toast.error('Please generate or write post content first.');
      return;
    }

    const totalSelected = selectedPages.length + selectedGroups.length;
    if (totalSelected === 0) {
      toast.error('Please select at least one page or group to publish to.');
      return;
    }

    setShowPublishDialog(true);
  };

  // Execute publish
  const handleConfirmPublish = async () => {
    setShowPublishDialog(false);

    // Map selected IDs back to objects
    const targetPages = pages.filter((p) => selectedPages.includes(p.companyId || p.id));
    const targetGroups = groups.filter((g) => selectedGroups.includes(g.groupId || g.id));

    const results = await post(content, targetPages, targetGroups);
    if (results) {
      setShowResultsModal(true);
    }
  };

  const totalTargetsCount = selectedPages.length + selectedGroups.length;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Page Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create & Generate Content</h1>
          <p className="text-sm text-slate-500 mt-1">
            Generate AI-crafted LinkedIn posts tailored to your company's tone and distribute across pages and groups.
          </p>
        </div>
      </div>

      {/* SECTION 1: Company, Topic & Image Prompt */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <div className="p-1.5 rounded-lg bg-sky-50 text-[#0077B5]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Step 1: Topic & AI Generation</h2>
            <p className="text-xs text-slate-500">
              Provide context for LangGraph AI to generate your post
            </p>
          </div>
        </div>

        <TopicInput
          company={selectedCompany}
          onCompanyChange={setSelectedCompany}
          topic={topic}
          onTopicChange={setTopic}
          notes={notes}
          onNotesChange={setNotes}
          tone={tone}
          onToneChange={setTone}
          disabled={isGenerating || isPosting}
        />

        <ImageUpload
          image={image}
          onImageChange={setImage}
          disabled={isGenerating || isPosting}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-500">
            Powered by LangGraph AI. Generation typically takes 15–30 seconds.
          </div>

          <div className="flex items-center gap-2">
            {!content && (
              <button
                type="button"
                onClick={() => setContent('Write your post here...')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Write Manually
              </button>
            )}

            <GenerateButton
              onGenerate={handleGenerate}
              isLoading={isGenerating}
              disabled={!topic.trim() || isPosting}
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Content Preview & Edit (Appears when content exists or is being written) */}
      {content && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Editor */}
            <div className="lg:col-span-7">
              <ContentEditor
                content={content}
                onContentChange={setContent}
                onRegenerate={handleGenerate}
                onDiscard={() => setShowDiscardDialog(true)}
                isGenerating={isGenerating}
                disabled={isPosting}
              />
            </div>

            {/* Right: Live LinkedIn Preview */}
            <div className="lg:col-span-5 sticky top-20">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#0077B5]" />
                <span>Live Feed Preview</span>
              </div>
              <PostPreview
                text={content}
                image={image}
                companyName={selectedCompany}
                subtitle="Company Page • Distribution System"
              />
            </div>
          </div>

          {/* SECTION 3: Select Targets */}
          <div className="pt-2">
            <TargetSelector
              selectedPages={selectedPages}
              selectedGroups={selectedGroups}
              onPagesChange={setSelectedPages}
              onGroupsChange={setSelectedGroups}
              disabled={isPosting}
            />
          </div>

          {/* SECTION 4: Publish Action Bar */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Ready to Distribute?
              </div>
              <div className="text-xs text-slate-500">
                {totalTargetsCount === 0 ? (
                  <span className="text-amber-600 font-medium">Select at least one page or group above</span>
                ) : (
                  <span>
                    Will sequentially publish to <strong className="text-slate-800">{selectedPages.length}</strong> pages and <strong className="text-slate-800">{selectedGroups.length}</strong> groups with anti-detection pacing.
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              disabled={isPosting || totalTargetsCount === 0}
              onClick={handleInitiatePublish}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-bold text-white bg-[#0077B5] hover:bg-[#005f8d] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#0077B5]/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Publish Now ({totalTargetsCount} targets)</span>
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={showDiscardDialog}
        title="Discard Generated Content?"
        message="Are you sure you want to discard this post? Any edits made will be lost."
        confirmLabel="Discard Post"
        cancelLabel="Keep Editing"
        isDanger={true}
        onConfirm={handleConfirmDiscard}
        onCancel={() => setShowDiscardDialog(false)}
      />

      <ConfirmDialog
        isOpen={showPublishDialog}
        title="Confirm LinkedIn Distribution"
        message={`You are about to publish this post to ${selectedPages.length} company page(s) and ${selectedGroups.length} group(s). Due to human-pacing delays, this operation will take approximately ${Math.max(30, totalTargetsCount * 15)} seconds.`}
        confirmLabel="Proceed & Publish"
        cancelLabel="Cancel"
        onConfirm={handleConfirmPublish}
        onCancel={() => setShowPublishDialog(false)}
      />

      {/* Loading Overlay */}
      <LoadingOverlay
        isOpen={isPosting}
        title="Publishing Post to LinkedIn..."
        subtitle={`Distributing sequentially to ${totalTargetsCount} targets`}
        progress={postingProgress}
      />

      {/* Results Popup Modal */}
      <ResultsPopup
        isOpen={showResultsModal}
        onClose={() => setShowResultsModal(false)}
        results={lastResults || []}
        title="Content Publishing Results"
        onResetForm={handleResetForm}
      />
    </div>
  );
};

export default CreateContent;
