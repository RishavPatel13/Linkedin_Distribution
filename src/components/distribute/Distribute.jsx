import React, { useState } from 'react';
import { Share2, Repeat2, Copy, Send, Eye, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import { useApp } from '../../context/AppContext';
import { usePost } from '../../hooks/usePost';

import UrlInput from './UrlInput';
import ActionToggle from './ActionToggle';
import Commentary from './Commentary';
import ContentEditor from '../create/ContentEditor';
import TargetSelector from '../common/TargetSelector';
import PostPreview from '../common/PostPreview';
import LoadingOverlay from '../common/LoadingOverlay';
import ResultsPopup from '../common/ResultsPopup';
import ConfirmDialog from '../common/ConfirmDialog';

export const Distribute = () => {
  const { pages, groups } = useApp();
  const {
    isPosting,
    isPreviewing,
    postingProgress,
    lastResults,
    preview,
    post,
    reshare,
  } = usePost();

  // Inputs
  const [postUrl, setPostUrl] = useState('');
  const [previewData, setPreviewData] = useState(null);
  const [action, setAction] = useState('reshare'); // 'reshare' | 'copy'
  const [commentary, setCommentary] = useState('');
  const [copiedContent, setCopiedContent] = useState('');

  // Target selectors
  const [selectedPages, setSelectedPages] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);

  // Modals
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);

  // Load preview handler
  const handleLoadPreview = async () => {
    if (!postUrl.trim()) {
      toast.error('Please enter a LinkedIn post URL');
      return;
    }
    const data = await preview(postUrl);
    if (data) {
      setPreviewData(data);
      setCopiedContent(data.text || '');
    }
  };

  // Reset form
  const handleResetForm = () => {
    setPostUrl('');
    setPreviewData(null);
    setCommentary('');
    setCopiedContent('');
    setSelectedPages([]);
    setSelectedGroups([]);
  };

  // Submit trigger
  const handleInitiatePublish = () => {
    const totalTargets = selectedPages.length + selectedGroups.length;
    if (totalTargets === 0) {
      toast.error('Please select at least one page or group to distribute to.');
      return;
    }
    setShowConfirmModal(true);
  };

  // Confirm publish
  const handleConfirmPublish = async () => {
    setShowConfirmModal(false);

    const targetPages = pages.filter((p) => selectedPages.includes(p.companyId || p.id));
    const targetGroups = groups.filter((g) => selectedGroups.includes(g.groupId || g.id));

    let results;
    if (action === 'reshare') {
      results = await reshare(postUrl, commentary, targetPages, targetGroups);
    } else {
      results = await post(copiedContent, targetPages, targetGroups);
    }

    if (results) {
      setShowResultsModal(true);
    }
  };

  const totalTargetsCount = selectedPages.length + selectedGroups.length;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Distribute & Reshare Posts
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Amplify existing LinkedIn posts across your network of company pages and industry groups in seconds.
        </p>
      </div>

      {/* SECTION 1: URL Input */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <div className="p-1.5 rounded-lg bg-sky-50 text-[#0077B5]">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Step 1: Paste LinkedIn Post URL</h2>
            <p className="text-xs text-slate-500">
              Fetch post preview from any public LinkedIn update
            </p>
          </div>
        </div>

        <UrlInput
          url={postUrl}
          onUrlChange={setPostUrl}
          onLoadPreview={handleLoadPreview}
          isLoading={isPreviewing}
          disabled={isPosting}
        />
      </div>

      {/* SECTION 2: Preview & Configuration */}
      {previewData && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Step 2: Preview & Configure Action</h2>
                  <p className="text-xs text-slate-500">
                    Choose whether to natively reshare or republish as a fresh post
                  </p>
                </div>
              </div>

              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-mono">
                URN: {previewData.activityId || 'Resolved'}
              </span>
            </div>

            {/* Action Toggle */}
            <ActionToggle
              action={action}
              onActionChange={setAction}
              disabled={isPosting}
            />

            {/* Sub-Editor based on action */}
            {action === 'reshare' ? (
              <Commentary
                commentary={commentary}
                onCommentaryChange={setCommentary}
                disabled={isPosting}
              />
            ) : (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Extracted Post Content (Editable)
                </label>
                <textarea
                  value={copiedContent}
                  disabled={isPosting}
                  onChange={(e) => setCopiedContent(e.target.value)}
                  rows={6}
                  className="w-full p-4 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-300 rounded-xl text-sm leading-relaxed text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0077B5] transition-all resize-y"
                  placeholder="Review or edit copied text..."
                />
              </div>
            )}
          </div>

          {/* Live Preview of how it will look */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 px-1">
              <Eye className="w-3.5 h-3.5 text-[#0077B5]" />
              <span>Target Feed Preview</span>
            </div>
            <PostPreview
              author={action === 'reshare' ? previewData.author : undefined}
              text={action === 'reshare' ? previewData.text : copiedContent}
              isReshare={action === 'reshare'}
              commentary={commentary}
              companyName={action === 'copy' ? (pages[0]?.name || 'Your Company') : undefined}
              subtitle={action === 'reshare' ? 'Original Author • LinkedIn Contributor' : 'Company Page'}
            />
          </div>

          {/* SECTION 3: Target Selection */}
          <div className="pt-2">
            <TargetSelector
              selectedPages={selectedPages}
              selectedGroups={selectedGroups}
              onPagesChange={setSelectedPages}
              onGroupsChange={setSelectedGroups}
              disabled={isPosting}
            />
          </div>

          {/* SECTION 4: Action Bar */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Ready to Distribute Post?
              </div>
              <div className="text-xs text-slate-500">
                {totalTargetsCount === 0 ? (
                  <span className="text-amber-600 font-medium">Select at least one page or group above</span>
                ) : (
                  <span>
                    Will {action === 'reshare' ? 'reshare' : 'publish copy'} to{' '}
                    <strong className="text-slate-800">{selectedPages.length}</strong> pages and{' '}
                    <strong className="text-slate-800">{selectedGroups.length}</strong> groups with anti-detection delays.
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
              {action === 'reshare' ? <Repeat2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              <span>
                {action === 'reshare' ? 'Reshare Post Now' : 'Publish Copy Now'} ({totalTargetsCount} targets)
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirmModal}
        title={`Confirm ${action === 'reshare' ? 'Reshare' : 'Post Copy'} Distribution`}
        message={`You are about to distribute this LinkedIn update across ${selectedPages.length} company page(s) and ${selectedGroups.length} group(s). Due to human-pacing anti-spam rules, this operation will take approximately ${Math.max(30, totalTargetsCount * 15)} seconds.`}
        confirmLabel="Distribute Post"
        cancelLabel="Cancel"
        onConfirm={handleConfirmPublish}
        onCancel={() => setShowConfirmModal(false)}
      />

      {/* Loading Overlay */}
      <LoadingOverlay
        isOpen={isPosting}
        title={action === 'reshare' ? 'Resharing Post to LinkedIn...' : 'Publishing Copy to LinkedIn...'}
        subtitle={`Sequential delivery to ${totalTargetsCount} targets with anti-detection delays`}
        progress={postingProgress}
      />

      {/* Results Modal */}
      <ResultsPopup
        isOpen={showResultsModal}
        onClose={() => setShowResultsModal(false)}
        results={lastResults || []}
        title={action === 'reshare' ? 'Reshare Distribution Results' : 'Publishing Results'}
        onResetForm={handleResetForm}
      />
    </div>
  );
};

export default Distribute;
